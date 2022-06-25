class Response {
  #socket;
  #protocol;
  #statusCode;
  #statusMessages;

  constructor(socket, { protocol }) {
    this.#socket = socket;
    this.#protocol = protocol;
    this.#statusCode = 200;
    this.#statusMessages = { 200: 'OK', 404: 'Not Found' };
  }

  set statusCode(code) {
    this.#statusCode = code;
  }

  send(body) {
    const CRLF = '\r\n';

    const statusMessage = this.#statusMessages[this.#statusCode];
    const headerLine = `${this.#protocol} ${this.#statusCode} 
    ${statusMessage}${CRLF}`;

    this.#socket.write(headerLine);
    this.#socket.write(CRLF);
    this.#socket.write(body);
    this.#socket.end();
  }
}

module.exports = { Response };
