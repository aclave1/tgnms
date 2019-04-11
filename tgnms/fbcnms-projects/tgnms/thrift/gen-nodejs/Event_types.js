//
// Autogenerated by Thrift Compiler (0.9.1)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
'use strict';

const thrift = require('thrift');
const Thrift = thrift.Thrift;
const Q = thrift.Q;

const ttypes = module.exports = {};
ttypes.EventCategory = {
'IGNITION' : 100,
'TOPOLOGY' : 200,
'UPGRADE' : 300,
'SCAN' : 400,
'CONFIG' : 500,
'TRAFFIC' : 600,
'STATUS' : 700,
'DRIVER' : 800,
'SCHEDULER' : 900,
'OPENR' : 1000,
'WATCHDOG' : 1100,
'SYSTEM' : 1200,
'FIRMWARE' : 1300,
'ZMQ' : 1400,
};
ttypes.EventSubcategory = {
'LINK' : 10,
'NODE' : 11,
'TOPOLOGY' : 12,
'ADD_NODE' : 200,
'DEL_NODE' : 201,
'EDIT_NODE' : 202,
'ADD_LINK' : 203,
'DEL_LINK' : 204,
'EDIT_LINK' : 205,
'ADD_SITE' : 206,
'DEL_SITE' : 207,
'EDIT_SITE' : 208,
'IMAGE' : 300,
'PREPARE' : 301,
'COMMIT' : 302,
'TIMEOUT' : 303,
'REPAIR_FW_RESTART' : 1000,
'REPAIR_NO_FW_RESTART' : 1001,
'REBOOT' : 1002,
'IO' : 1200,
'CMD' : 1201,
'PARSE' : 1202,
'NETLINK' : 1300,
};
ttypes.EventLevel = {
'INFO' : 10,
'WARNING' : 20,
'ERROR' : 30,
'FATAL' : 40,
};
const Event = module.exports.Event = function(args) {
  this.source = null;
  this.timestamp = null;
  this.reason = null;
  this.details = null;
  this.category = null;
  this.subcategory = null;
  this.level = null;
  if (args) {
    if (args.source !== undefined) {
      this.source = args.source;
    }
    if (args.timestamp !== undefined) {
      this.timestamp = args.timestamp;
    }
    if (args.reason !== undefined) {
      this.reason = args.reason;
    }
    if (args.details !== undefined) {
      this.details = args.details;
    }
    if (args.category !== undefined) {
      this.category = args.category;
    }
    if (args.subcategory !== undefined) {
      this.subcategory = args.subcategory;
    }
    if (args.level !== undefined) {
      this.level = args.level;
    }
  }
};
Event.prototype = {};
Event.prototype.read = function(input) {
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
        this.source = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.I64) {
        this.timestamp = input.readI64();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.reason = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.details = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.I32) {
        this.category = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 6:
      if (ftype == Thrift.Type.I32) {
        this.subcategory = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 7:
      if (ftype == Thrift.Type.I32) {
        this.level = input.readI32();
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

Event.prototype.write = function(output) {
  output.writeStructBegin('Event');
  if (this.source !== null && this.source !== undefined) {
    output.writeFieldBegin('source', Thrift.Type.STRING, 1);
    output.writeString(this.source);
    output.writeFieldEnd();
  }
  if (this.timestamp !== null && this.timestamp !== undefined) {
    output.writeFieldBegin('timestamp', Thrift.Type.I64, 2);
    output.writeI64(this.timestamp);
    output.writeFieldEnd();
  }
  if (this.reason !== null && this.reason !== undefined) {
    output.writeFieldBegin('reason', Thrift.Type.STRING, 3);
    output.writeString(this.reason);
    output.writeFieldEnd();
  }
  if (this.details !== null && this.details !== undefined) {
    output.writeFieldBegin('details', Thrift.Type.STRING, 4);
    output.writeString(this.details);
    output.writeFieldEnd();
  }
  if (this.category !== null && this.category !== undefined) {
    output.writeFieldBegin('category', Thrift.Type.I32, 5);
    output.writeI32(this.category);
    output.writeFieldEnd();
  }
  if (this.subcategory !== null && this.subcategory !== undefined) {
    output.writeFieldBegin('subcategory', Thrift.Type.I32, 6);
    output.writeI32(this.subcategory);
    output.writeFieldEnd();
  }
  if (this.level !== null && this.level !== undefined) {
    output.writeFieldBegin('level', Thrift.Type.I32, 7);
    output.writeI32(this.level);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};
