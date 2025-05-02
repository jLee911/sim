
const colyseus = require("colyseus");
const http = require("http");
const express = require("express");
const { Server } = require("colyseus");
const { Room } = require("colyseus");

const app = express();
const gameServer = new Server({
  server: http.createServer(app)
});

class GoatRoom extends Room {
  onCreate() {
    this.setState({ players: {} });

    this.onMessage("scream", (client) => {
      this.broadcast("scream", null, { except: client });
    });
  }

  onJoin(client) {
    this.state.players[client.sessionId] = { x: 0, y: 0 };
    this.send(client, "joined", { id: client.sessionId });
  }

  onLeave(client) {
    delete this.state.players[client.sessionId];
  }

  onDispose() {}
}

gameServer.define("goats", GoatRoom);
gameServer.listen(2567);
console.log("Colyseus Goat server running on ws://localhost:2567");
