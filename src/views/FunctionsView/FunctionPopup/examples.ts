export const examples = {
  'weather': {
    sdl: `type WeatherPayload {
  temperature: Float!
  pressure: Float!
  windSpeed: Float!
}

extend type Query {
  weather(city: String!): WeatherPayload
}
`,
    code: `const fetch = require('node-fetch')

module.exports = function (event) {
  const city = event.data.city
  return fetch(getApiUrl(city))
  .then(res => res.json())
  .then(data => {
    console.log(data)
    return {
      data: {
        temperature: data.main.temp,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
      }
    }
  })
}

function getApiUrl(query) {
	return \`http://samples.openweathermap.org/data/2.5/weather?q=$\{query\}&appid=b1b15e88fa797225412429c1c50c122a1\`
  }`,
  },
  'cuid': {
    sdl: `type CuidPayload {
  cuid: String!
}

extend type Query {
  cuid(): CuidPayload
}
`,
    code: `const cuid = require('cuid')

module.exports = function (event) {
  return {
  	data: {
      cuid: cuid()
    }
  }
}`,
  },
}
