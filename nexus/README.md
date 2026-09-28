# BZ Audio Command Center

First working version of the BZ Audio Command Center.

## Working now
- Responsive command-center interface
- Real PostgreSQL persistence for projects/modules/events
- Real Allen & Heath SQ MIDI-over-TCP/IP connection
- SQ connection/disconnection status
- Raw MIDI test endpoint
- Input mute control for SQ channels 1-48
- Scene recall
- Audio Doctor starter workflow
- Show Mode and event activity UI

## SQ networking
Allen & Heath documents MIDI-over-TCP/IP for SQ and specifies port 51325 for network MIDI clients. The server must be able to reach the SQ on the same local network.

Set DATABASE_URL for persistence, then run:

    npm install
    npm start

Open the server on port 3000.

## Safety
This app controls live audio equipment. Keep it on a trusted LAN and add authentication/VPN before exposing it outside the local network. The first version deliberately exposes only a small set of documented MIDI actions.

## Next integration
Live meters/read-back, DCA and mute groups, EQ/gate/compressor control, device discovery, richer diagnostics, authentication, and additional equipment adapters.
