let process = {
  development: {
    textUrl: "http://localhost:8717",
    proxyUrl: "http://localhost:8718"
  },
  test: {
    textUrl: "http://119.45.242.136:8717",
    proxyUrl: "http://119.45.242.136:8718",
  },
  production: {
    textUrl: "http://119.45.242.136:8717",
    proxyUrl: "http://119.45.242.136:8718"
  }
}

export default process