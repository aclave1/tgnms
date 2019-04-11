//
// Autogenerated by Thrift Compiler (0.11.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
'use strict';

const thrift = require('thrift');
const Thrift = thrift.Thrift;
const Q = thrift.Q;


const ttypes = module.exports = {};
ttypes.MonitorCommand = {
  'SET_COUNTER_VALUES' : 1,
  'GET_COUNTER_VALUES' : 2,
  'DUMP_ALL_COUNTER_NAMES' : 3,
  'DUMP_ALL_COUNTER_DATA' : 4,
  'BUMP_COUNTER' : 5,
  'GET_EVENT_LOGS' : 6,
  'LOG_EVENT' : 11,
};
ttypes.CounterValueType = {
  'GAUGE' : 1,
  'COUNTER' : 2,
};
ttypes.PubType = {
  'COUNTER_PUB' : 1,
  'EVENT_LOG_PUB' : 2,
};
const Counter = module.exports.Counter = function(args) {
  this.value = null;
  this.valueType = null;
  this.timestamp = null;
  if (args) {
    if (args.value !== undefined && args.value !== null) {
      this.value = args.value;
    }
    if (args.valueType !== undefined && args.valueType !== null) {
      this.valueType = args.valueType;
    }
    if (args.timestamp !== undefined && args.timestamp !== null) {
      this.timestamp = args.timestamp;
    }
  }
};
Counter.prototype = {};
Counter.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    const ret = input.readFieldBegin();
    const fname = ret.fname;
    const ftype = ret.ftype;
    const fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 10:
      if (ftype == Thrift.Type.DOUBLE) {
        this.value = input.readDouble();
      } else {
        input.skip(ftype);
      }
      break;
      case 11:
      if (ftype == Thrift.Type.I32) {
        this.valueType = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 12:
      if (ftype == Thrift.Type.I64) {
        this.timestamp = input.readI64();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Counter.prototype.write = function(output) {
  output.writeStructBegin('Counter');
  if (this.value !== null && this.value !== undefined) {
    output.writeFieldBegin('value', Thrift.Type.DOUBLE, 10);
    output.writeDouble(this.value);
    output.writeFieldEnd();
  }
  if (this.valueType !== null && this.valueType !== undefined) {
    output.writeFieldBegin('valueType', Thrift.Type.I32, 11);
    output.writeI32(this.valueType);
    output.writeFieldEnd();
  }
  if (this.timestamp !== null && this.timestamp !== undefined) {
    output.writeFieldBegin('timestamp', Thrift.Type.I64, 12);
    output.writeI64(this.timestamp);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

const CounterSetParams = module.exports.CounterSetParams = function(args) {
  this.counters = null;
  if (args) {
    if (args.counters !== undefined && args.counters !== null) {
      this.counters = Thrift.copyMap(args.counters, [null]);
    }
  }
};
CounterSetParams.prototype = {};
CounterSetParams.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    const ret = input.readFieldBegin();
    const fname = ret.fname;
    const ftype = ret.ftype;
    const fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.MAP) {
        let _size0 = 0;
        var _rtmp34;
        this.counters = {};
        let _ktype1 = 0;
        let _vtype2 = 0;
        _rtmp34 = input.readMapBegin();
        _ktype1 = _rtmp34.ktype;
        _vtype2 = _rtmp34.vtype;
        _size0 = _rtmp34.size;
        for (let _i5 = 0; _i5 < _size0; ++_i5) {
          let key6 = null;
          let val7 = null;
          key6 = input.readString();
          val7 = new ttypes.Counter();
          val7.read(input);
          this.counters[key6] = val7;
        }
        input.readMapEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

CounterSetParams.prototype.write = function(output) {
  output.writeStructBegin('CounterSetParams');
  if (this.counters !== null && this.counters !== undefined) {
    output.writeFieldBegin('counters', Thrift.Type.MAP, 1);
    output.writeMapBegin(Thrift.Type.STRING, Thrift.Type.STRUCT, Thrift.objectLength(this.counters));
    for (const kiter8 in this.counters) {
      if (this.counters.hasOwnProperty(kiter8)) {
        const viter9 = this.counters[kiter8];
        output.writeString(kiter8);
        viter9.write(output);
      }
    }
    output.writeMapEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

const CounterGetParams = module.exports.CounterGetParams = function(args) {
  this.counterNames = null;
  if (args) {
    if (args.counterNames !== undefined && args.counterNames !== null) {
      this.counterNames = Thrift.copyList(args.counterNames, [null]);
    }
  }
};
CounterGetParams.prototype = {};
CounterGetParams.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    const ret = input.readFieldBegin();
    const fname = ret.fname;
    const ftype = ret.ftype;
    const fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.LIST) {
        let _size10 = 0;
        var _rtmp314;
        this.counterNames = [];
        let _etype13 = 0;
        _rtmp314 = input.readListBegin();
        _etype13 = _rtmp314.etype;
        _size10 = _rtmp314.size;
        for (let _i15 = 0; _i15 < _size10; ++_i15) {
          let elem16 = null;
          elem16 = input.readString();
          this.counterNames.push(elem16);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

CounterGetParams.prototype.write = function(output) {
  output.writeStructBegin('CounterGetParams');
  if (this.counterNames !== null && this.counterNames !== undefined) {
    output.writeFieldBegin('counterNames', Thrift.Type.LIST, 1);
    output.writeListBegin(Thrift.Type.STRING, this.counterNames.length);
    for (let iter17 in this.counterNames) {
      if (this.counterNames.hasOwnProperty(iter17)) {
        iter17 = this.counterNames[iter17];
        output.writeString(iter17);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

const CounterBumpParams = module.exports.CounterBumpParams = function(args) {
  this.counterNames = null;
  if (args) {
    if (args.counterNames !== undefined && args.counterNames !== null) {
      this.counterNames = Thrift.copyList(args.counterNames, [null]);
    }
  }
};
CounterBumpParams.prototype = {};
CounterBumpParams.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    const ret = input.readFieldBegin();
    const fname = ret.fname;
    const ftype = ret.ftype;
    const fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.LIST) {
        let _size18 = 0;
        var _rtmp322;
        this.counterNames = [];
        let _etype21 = 0;
        _rtmp322 = input.readListBegin();
        _etype21 = _rtmp322.etype;
        _size18 = _rtmp322.size;
        for (let _i23 = 0; _i23 < _size18; ++_i23) {
          let elem24 = null;
          elem24 = input.readString();
          this.counterNames.push(elem24);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

CounterBumpParams.prototype.write = function(output) {
  output.writeStructBegin('CounterBumpParams');
  if (this.counterNames !== null && this.counterNames !== undefined) {
    output.writeFieldBegin('counterNames', Thrift.Type.LIST, 1);
    output.writeListBegin(Thrift.Type.STRING, this.counterNames.length);
    for (let iter25 in this.counterNames) {
      if (this.counterNames.hasOwnProperty(iter25)) {
        iter25 = this.counterNames[iter25];
        output.writeString(iter25);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

const EventLog = module.exports.EventLog = function(args) {
  this.category = null;
  this.samples = null;
  if (args) {
    if (args.category !== undefined && args.category !== null) {
      this.category = args.category;
    }
    if (args.samples !== undefined && args.samples !== null) {
      this.samples = Thrift.copyList(args.samples, [null]);
    }
  }
};
EventLog.prototype = {};
EventLog.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    const ret = input.readFieldBegin();
    const fname = ret.fname;
    const ftype = ret.ftype;
    const fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.category = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.LIST) {
        let _size26 = 0;
        var _rtmp330;
        this.samples = [];
        let _etype29 = 0;
        _rtmp330 = input.readListBegin();
        _etype29 = _rtmp330.etype;
        _size26 = _rtmp330.size;
        for (let _i31 = 0; _i31 < _size26; ++_i31) {
          let elem32 = null;
          elem32 = input.readString();
          this.samples.push(elem32);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

EventLog.prototype.write = function(output) {
  output.writeStructBegin('EventLog');
  if (this.category !== null && this.category !== undefined) {
    output.writeFieldBegin('category', Thrift.Type.STRING, 1);
    output.writeString(this.category);
    output.writeFieldEnd();
  }
  if (this.samples !== null && this.samples !== undefined) {
    output.writeFieldBegin('samples', Thrift.Type.LIST, 2);
    output.writeListBegin(Thrift.Type.STRING, this.samples.length);
    for (let iter33 in this.samples) {
      if (this.samples.hasOwnProperty(iter33)) {
        iter33 = this.samples[iter33];
        output.writeString(iter33);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

const MonitorRequest = module.exports.MonitorRequest = function(args) {
  this.cmd = null;
  this.counterSetParams = null;
  this.counterGetParams = null;
  this.counterBumpParams = null;
  this.eventLog = null;
  if (args) {
    if (args.cmd !== undefined && args.cmd !== null) {
      this.cmd = args.cmd;
    }
    if (args.counterSetParams !== undefined && args.counterSetParams !== null) {
      this.counterSetParams = new ttypes.CounterSetParams(args.counterSetParams);
    }
    if (args.counterGetParams !== undefined && args.counterGetParams !== null) {
      this.counterGetParams = new ttypes.CounterGetParams(args.counterGetParams);
    }
    if (args.counterBumpParams !== undefined && args.counterBumpParams !== null) {
      this.counterBumpParams = new ttypes.CounterBumpParams(args.counterBumpParams);
    }
    if (args.eventLog !== undefined && args.eventLog !== null) {
      this.eventLog = new ttypes.EventLog(args.eventLog);
    }
  }
};
MonitorRequest.prototype = {};
MonitorRequest.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    const ret = input.readFieldBegin();
    const fname = ret.fname;
    const ftype = ret.ftype;
    const fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.I32) {
        this.cmd = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRUCT) {
        this.counterSetParams = new ttypes.CounterSetParams();
        this.counterSetParams.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRUCT) {
        this.counterGetParams = new ttypes.CounterGetParams();
        this.counterGetParams.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRUCT) {
        this.counterBumpParams = new ttypes.CounterBumpParams();
        this.counterBumpParams.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.STRUCT) {
        this.eventLog = new ttypes.EventLog();
        this.eventLog.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

MonitorRequest.prototype.write = function(output) {
  output.writeStructBegin('MonitorRequest');
  if (this.cmd !== null && this.cmd !== undefined) {
    output.writeFieldBegin('cmd', Thrift.Type.I32, 1);
    output.writeI32(this.cmd);
    output.writeFieldEnd();
  }
  if (this.counterSetParams !== null && this.counterSetParams !== undefined) {
    output.writeFieldBegin('counterSetParams', Thrift.Type.STRUCT, 2);
    this.counterSetParams.write(output);
    output.writeFieldEnd();
  }
  if (this.counterGetParams !== null && this.counterGetParams !== undefined) {
    output.writeFieldBegin('counterGetParams', Thrift.Type.STRUCT, 3);
    this.counterGetParams.write(output);
    output.writeFieldEnd();
  }
  if (this.counterBumpParams !== null && this.counterBumpParams !== undefined) {
    output.writeFieldBegin('counterBumpParams', Thrift.Type.STRUCT, 4);
    this.counterBumpParams.write(output);
    output.writeFieldEnd();
  }
  if (this.eventLog !== null && this.eventLog !== undefined) {
    output.writeFieldBegin('eventLog', Thrift.Type.STRUCT, 5);
    this.eventLog.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

const CounterValuesResponse = module.exports.CounterValuesResponse = function(args) {
  this.counters = null;
  if (args) {
    if (args.counters !== undefined && args.counters !== null) {
      this.counters = Thrift.copyMap(args.counters, [null]);
    }
  }
};
CounterValuesResponse.prototype = {};
CounterValuesResponse.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    const ret = input.readFieldBegin();
    const fname = ret.fname;
    const ftype = ret.ftype;
    const fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.MAP) {
        let _size34 = 0;
        var _rtmp338;
        this.counters = {};
        let _ktype35 = 0;
        let _vtype36 = 0;
        _rtmp338 = input.readMapBegin();
        _ktype35 = _rtmp338.ktype;
        _vtype36 = _rtmp338.vtype;
        _size34 = _rtmp338.size;
        for (let _i39 = 0; _i39 < _size34; ++_i39) {
          let key40 = null;
          let val41 = null;
          key40 = input.readString();
          val41 = new ttypes.Counter();
          val41.read(input);
          this.counters[key40] = val41;
        }
        input.readMapEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

CounterValuesResponse.prototype.write = function(output) {
  output.writeStructBegin('CounterValuesResponse');
  if (this.counters !== null && this.counters !== undefined) {
    output.writeFieldBegin('counters', Thrift.Type.MAP, 1);
    output.writeMapBegin(Thrift.Type.STRING, Thrift.Type.STRUCT, Thrift.objectLength(this.counters));
    for (const kiter42 in this.counters) {
      if (this.counters.hasOwnProperty(kiter42)) {
        const viter43 = this.counters[kiter42];
        output.writeString(kiter42);
        viter43.write(output);
      }
    }
    output.writeMapEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

const EventLogsResponse = module.exports.EventLogsResponse = function(args) {
  this.eventLogs = null;
  if (args) {
    if (args.eventLogs !== undefined && args.eventLogs !== null) {
      this.eventLogs = Thrift.copyList(args.eventLogs, [ttypes.EventLog]);
    }
  }
};
EventLogsResponse.prototype = {};
EventLogsResponse.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    const ret = input.readFieldBegin();
    const fname = ret.fname;
    const ftype = ret.ftype;
    const fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.LIST) {
        let _size44 = 0;
        var _rtmp348;
        this.eventLogs = [];
        let _etype47 = 0;
        _rtmp348 = input.readListBegin();
        _etype47 = _rtmp348.etype;
        _size44 = _rtmp348.size;
        for (let _i49 = 0; _i49 < _size44; ++_i49) {
          let elem50 = null;
          elem50 = new ttypes.EventLog();
          elem50.read(input);
          this.eventLogs.push(elem50);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

EventLogsResponse.prototype.write = function(output) {
  output.writeStructBegin('EventLogsResponse');
  if (this.eventLogs !== null && this.eventLogs !== undefined) {
    output.writeFieldBegin('eventLogs', Thrift.Type.LIST, 1);
    output.writeListBegin(Thrift.Type.STRUCT, this.eventLogs.length);
    for (let iter51 in this.eventLogs) {
      if (this.eventLogs.hasOwnProperty(iter51)) {
        iter51 = this.eventLogs[iter51];
        iter51.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

const CounterNamesResponse = module.exports.CounterNamesResponse = function(args) {
  this.counterNames = null;
  if (args) {
    if (args.counterNames !== undefined && args.counterNames !== null) {
      this.counterNames = Thrift.copyList(args.counterNames, [null]);
    }
  }
};
CounterNamesResponse.prototype = {};
CounterNamesResponse.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    const ret = input.readFieldBegin();
    const fname = ret.fname;
    const ftype = ret.ftype;
    const fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.LIST) {
        let _size52 = 0;
        var _rtmp356;
        this.counterNames = [];
        let _etype55 = 0;
        _rtmp356 = input.readListBegin();
        _etype55 = _rtmp356.etype;
        _size52 = _rtmp356.size;
        for (let _i57 = 0; _i57 < _size52; ++_i57) {
          let elem58 = null;
          elem58 = input.readString();
          this.counterNames.push(elem58);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

CounterNamesResponse.prototype.write = function(output) {
  output.writeStructBegin('CounterNamesResponse');
  if (this.counterNames !== null && this.counterNames !== undefined) {
    output.writeFieldBegin('counterNames', Thrift.Type.LIST, 1);
    output.writeListBegin(Thrift.Type.STRING, this.counterNames.length);
    for (let iter59 in this.counterNames) {
      if (this.counterNames.hasOwnProperty(iter59)) {
        iter59 = this.counterNames[iter59];
        output.writeString(iter59);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

const MonitorPub = module.exports.MonitorPub = function(args) {
  this.pubType = null;
  this.counterPub = null;
  this.eventLogPub = null;
  if (args) {
    if (args.pubType !== undefined && args.pubType !== null) {
      this.pubType = args.pubType;
    }
    if (args.counterPub !== undefined && args.counterPub !== null) {
      this.counterPub = new ttypes.CounterValuesResponse(args.counterPub);
    }
    if (args.eventLogPub !== undefined && args.eventLogPub !== null) {
      this.eventLogPub = new ttypes.EventLog(args.eventLogPub);
    }
  }
};
MonitorPub.prototype = {};
MonitorPub.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    const ret = input.readFieldBegin();
    const fname = ret.fname;
    const ftype = ret.ftype;
    const fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.I32) {
        this.pubType = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRUCT) {
        this.counterPub = new ttypes.CounterValuesResponse();
        this.counterPub.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRUCT) {
        this.eventLogPub = new ttypes.EventLog();
        this.eventLogPub.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

MonitorPub.prototype.write = function(output) {
  output.writeStructBegin('MonitorPub');
  if (this.pubType !== null && this.pubType !== undefined) {
    output.writeFieldBegin('pubType', Thrift.Type.I32, 1);
    output.writeI32(this.pubType);
    output.writeFieldEnd();
  }
  if (this.counterPub !== null && this.counterPub !== undefined) {
    output.writeFieldBegin('counterPub', Thrift.Type.STRUCT, 2);
    this.counterPub.write(output);
    output.writeFieldEnd();
  }
  if (this.eventLogPub !== null && this.eventLogPub !== undefined) {
    output.writeFieldBegin('eventLogPub', Thrift.Type.STRUCT, 3);
    this.eventLogPub.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};
