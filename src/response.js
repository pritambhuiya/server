class Response {
  #socket;
  constructor(socket) {
    this.#socket = socket;
  }

  send(body) {
    this.#socket.write(body);
    this.#socket.end();
  }
}

module.exports = { Response };
