import express from "express";
import pg from "pg";
import net from "node:net";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const app=express();
app.use(express.json({limit:"1mb"}));
const PORT=process.env.PORT||3000;
const pool=process.env.DATABASE_URL?new pg.Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:false}}):null;
const sq={socket:null,ip:null,port:51325,connected:false};

async function db(sql,params=[]){if(!pool)return null;return pool.query(sql,params)}
async function init(){
 if(!pool)return;
 await db(\`CREATE EXTENSION IF NOT EXISTS pgcrypto;
 CREATE TABLE IF NOT EXISTS nexus_projects(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),name TEXT NOT NULL,description TEXT DEFAULT '',created_at TIMESTAMPTZ DEFAULT now());
 CREATE TABLE IF NOT EXISTS nexus_modules(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),project_id UUID REFERENCES nexus_projects(id) ON DELETE CASCADE,name TEXT NOT NULL,type TEXT NOT NULL,config JSONB DEFAULT '{}'::jsonb,created_at TIMESTAMPTZ DEFAULT now());
 CREATE TABLE IF NOT EXISTS nexus_events(id BIGSERIAL PRIMARY KEY,type TEXT NOT NULL,payload JSONB DEFAULT '{}'::jsonb,created_at TIMESTAMPTZ DEFAULT now());
 CREATE TABLE IF NOT EXISTS nexus_users(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),email TEXT UNIQUE NOT NULL,role TEXT DEFAULT 'user',created_at TIMESTAMPTZ DEFAULT now())\`);
}
async function event(type,payload={}){if(pool)await db("INSERT INTO nexus_events(type,payload) VALUES($1,$2)",[type,payload])}

function midiConnect(ip,port=51325){
 return new Promise((resolve,reject)=>{
  if(!/^\\d{1,3}(\\.\\d{1,3}){3}$/.test(ip))return reject(new Error("Enter a valid IPv4 address"));
  if(sq.socket){try{sq.socket.destroy()}catch{}}
  const socket=new net.Socket();
  socket.once("error",e=>{sq.connected=false;reject(new Error("SQ connection failed: "+e.message))});
  socket.once("connect",()=>{sq.socket=socket;sq.ip=ip;sq.port=port;sq.connected=true;resolve()});
  socket.on("close",()=>{sq.connected=false});
  socket.connect(port,ip);
 });
}
function sendHex(hex){
 if(!sq.socket||!sq.connected)throw new Error("SQ is not connected");
 const bytes=hex.trim().split(/\\s+/).filter(Boolean).map(x=>parseInt(x,16));
 if(bytes.some(Number.isNaN))throw new Error("Invalid MIDI hex");
 sq.socket.write(Buffer.from(bytes));
 return bytes.length;
}
function toHex(bytes){return Buffer.from(bytes).toString("hex").match(/../g).join(" ").toUpperCase()}

app.get("/health",async(_,res)=>{try{if(pool)await db("SELECT 1");res.json({ok:true,service:"BZ AUDIO COMMAND CENTER",database:!!pool,sq:{connected:sq.connected,ip:sq.ip,port:sq.port},time:new Date().toISOString()})}catch(e){res.status(503).json({ok:false,error:e.message})}});
app.get("/api/status",(_,res)=>res.json({database:!!pool,sq:{connected:sq.connected,ip:sq.ip,port:sq.port}}));

app.post("/api/sq/connect",async(req,res)=>{try{const ip=String(req.body.ip||"").trim();const port=Number(req.body.port||51325);await midiConnect(ip,port);await event("sq.connected",{ip,port});res.json({ok:true,ip,port})}catch(e){res.status(400).json({error:e.message})}});
app.post("/api/sq/disconnect",async(_,res)=>{if(sq.socket)try{sq.socket.destroy()}catch{}sq.socket=null;sq.connected=false;await event("sq.disconnected");res.json({ok:true})});
app.post("/api/sq/raw",async(req,res)=>{try{const bytes=sendHex(String(req.body.hex||""));await event("sq.midi.sent",{hex:String(req.body.hex),bytes});res.json({ok:true,bytes})}catch(e){res.status(400).json({error:e.message})}});

app.post("/api/sq/input-mute",async(req,res)=>{
 try{
  const channel=Number(req.body.channel), muted=Boolean(req.body.muted);
  if(!Number.isInteger(channel)||channel<1||channel>48)throw new Error("Input channel must be 1-48");
  if(!sq.connected)throw new Error("Connect an SQ first");
  const parameter=channel-1, mb=(parameter>>7)&127, lb=parameter&127;
  const bytes=[0xB0,0x63,mb,0xB0,0x62,lb,0xB0,0x06,0x00,0xB0,0x26,muted?0x01:0x00];
  sq.socket.write(Buffer.from(bytes));await event("sq.input_mute",{channel,muted});
  res.json({ok:true,channel,muted,hex:toHex(bytes)});
 }catch(e){res.status(400).json({error:e.message})}
});
app.post("/api/sq/scene",async(req,res)=>{
 try{
  const scene=Number(req.body.scene);
  if(!Number.isInteger(scene)||scene<1||scene>300)throw new Error("Scene must be 1-300");
  if(!sq.connected)throw new Error("Connect an SQ first");
  const bytes=[0xB0,0x00,0x00,0xC0,(scene-1)&127];
  sq.socket.write(Buffer.from(bytes));await event("sq.scene.recall",{scene});
  res.json({ok:true,scene,hex:toHex(bytes)});
 }catch(e){res.status(400).json({error:e.message})}
});

app.get("/api/projects",async(_,res)=>{try{const r=await db("SELECT * FROM nexus_projects ORDER BY created_at DESC");res.json(r?r.rows:[])}catch(e){res.status(500).json({error:e.message})}});
app.post("/api/projects",async(req,res)=>{try{const name=String(req.body.name||"").trim();if(!name)return res.status(400).json({error:"name is required"});const r=await db("INSERT INTO nexus_projects(name,description) VALUES($1,$2) RETURNING *",[name,String(req.body.description||"")]);if(!r)return res.status(503).json({error:"DATABASE_URL is not configured"});await event("project.created",{id:r.rows[0].id,name});res.status(201).json(r.rows[0])}catch(e){res.status(500).json({error:e.message})}});
app.get("/api/modules",async(req,res)=>{try{const r=await db("SELECT * FROM nexus_modules WHERE project_id=$1 ORDER BY created_at",[req.query.project_id]);res.json(r?r.rows:[])}catch(e){res.status(500).json({error:e.message})}});
app.post("/api/modules",async(req,res)=>{try{const {project_id,name,type,config={}}=req.body;if(!project_id||!name||!type)return res.status(400).json({error:"project_id, name and type are required"});const r=await db("INSERT INTO nexus_modules(project_id,name,type,config) VALUES($1,$2,$3,$4) RETURNING *",[project_id,name,type,config]);if(!r)return res.status(503).json({error:"DATABASE_URL is not configured"});await event("module.created",{id:r.rows[0].id,project_id,type});res.status(201).json(r.rows[0])}catch(e){res.status(500).json({error:e.message})}});
app.get("/api/events",async(_,res)=>{try{const r=await db("SELECT * FROM nexus_events ORDER BY created_at DESC LIMIT 50");res.json(r?r.rows:[])}catch(e){res.status(500).json({error:e.message})}});

app.use(express.static(path.join(__dirname,"public")));
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
init().then(()=>app.listen(PORT,()=>console.log("BZ Audio Command Center listening on "+PORT))).catch(e=>{console.error(e);process.exit(1)});