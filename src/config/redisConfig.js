import redis from 'redis';
import config from '.'
// import { promisify } from 'util';
import { promisifyAll } from 'bluebird'

// 使用bluebird封装redis，使其具有相应的异步函数
promisifyAll(redis);

const options = {
  host: config.REDIS.host,
  port: config.REDIS.port,
  password: config.REDIS.password,
  detect_buffers: true,
  retry_strategy: function(options) {
    if (options.error && options.error.code === "ECONNREFUSED") {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  }
}

const client = redis.createClient(options);

const setValue = (key, value, exp) => {
  if (typeof value === 'undefined' || value === null || value === '') {
    return;
  }
  else if (typeof value === 'object') {
    const keys = Object.keys(value);
    keys.forEach(item => {
      client.hset(key, item, value[item], redis.print);
    })
  }
  else {
    if (typeof exp === 'number') {
      return client.set(key, value, 'EX', exp)
    } else {
      return client.set(key, value);
    }
  }
}

// v8 Promisify method use util, must node > 8
// const getAsync = promisify(client.get).bind(client);

const getValue = (key) => {
  // return getAsync(key);
  return client.getAsync(key)
}

const getHValue = (key) => {
  // return promisify(client.hgetall).bind(client)(key);
  return client.hgetallAsync(key)
}

const delValue = (key) => {
  client.del(key, (err, res) => {
    if (res === 1) {
      console.log('delete successfully');
    } else {
      console.log('delete redis key error:' + err)
    }
  })
}

export {
  client,
  setValue,
  getValue,
  getHValue,
  delValue
}