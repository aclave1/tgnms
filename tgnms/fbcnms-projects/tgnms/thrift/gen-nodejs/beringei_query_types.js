//
// Autogenerated by Thrift Compiler (0.9.3)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
const thrift = require('thrift');
const Thrift = thrift.Thrift;
const Q = thrift.Q;


const ttypes = module.exports = {};
KeyData = module.exports.KeyData = function(args) {
  this.keyId = null;
  this.key = null;
  this.displayName = null;
  this.linkName = null;
  this.node = null;
  this.nodeName = null;
  this.siteName = null;
  if (args) {
    if (args.keyId !== undefined && args.keyId !== null) {
      this.keyId = args.keyId;
    }
    if (args.key !== undefined && args.key !== null) {
      this.key = args.key;
    }
    if (args.displayName !== undefined && args.displayName !== null) {
      this.displayName = args.displayName;
    }
    if (args.linkName !== undefined && args.linkName !== null) {
      this.linkName = args.linkName;
    }
    if (args.node !== undefined && args.node !== null) {
      this.node = args.node;
    }
    if (args.nodeName !== undefined && args.nodeName !== null) {
      this.nodeName = args.nodeName;
    }
    if (args.siteName !== undefined && args.siteName !== null) {
      this.siteName = args.siteName;
    }
  }
};
KeyData.prototype = {};
KeyData.prototype.read = function(input) {
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
      if (ftype == Thrift.Type.I64) {
        this.keyId = input.readI64();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.key = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 10:
      if (ftype == Thrift.Type.STRING) {
        this.displayName = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 11:
      if (ftype == Thrift.Type.STRING) {
        this.linkName = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 20:
      if (ftype == Thrift.Type.STRING) {
        this.node = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 21:
      if (ftype == Thrift.Type.STRING) {
        this.nodeName = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 30:
      if (ftype == Thrift.Type.STRING) {
        this.siteName = input.readString();
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

KeyData.prototype.write = function(output) {
  output.writeStructBegin('KeyData');
  if (this.keyId !== null && this.keyId !== undefined) {
    output.writeFieldBegin('keyId', Thrift.Type.I64, 1);
    output.writeI64(this.keyId);
    output.writeFieldEnd();
  }
  if (this.key !== null && this.key !== undefined) {
    output.writeFieldBegin('key', Thrift.Type.STRING, 2);
    output.writeString(this.key);
    output.writeFieldEnd();
  }
  if (this.displayName !== null && this.displayName !== undefined) {
    output.writeFieldBegin('displayName', Thrift.Type.STRING, 10);
    output.writeString(this.displayName);
    output.writeFieldEnd();
  }
  if (this.linkName !== null && this.linkName !== undefined) {
    output.writeFieldBegin('linkName', Thrift.Type.STRING, 11);
    output.writeString(this.linkName);
    output.writeFieldEnd();
  }
  if (this.node !== null && this.node !== undefined) {
    output.writeFieldBegin('node', Thrift.Type.STRING, 20);
    output.writeString(this.node);
    output.writeFieldEnd();
  }
  if (this.nodeName !== null && this.nodeName !== undefined) {
    output.writeFieldBegin('nodeName', Thrift.Type.STRING, 21);
    output.writeString(this.nodeName);
    output.writeFieldEnd();
  }
  if (this.siteName !== null && this.siteName !== undefined) {
    output.writeFieldBegin('siteName', Thrift.Type.STRING, 30);
    output.writeString(this.siteName);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Query = module.exports.Query = function(args) {
  this.type = null;
  this.key_ids = null;
  this.data = null;
  this.min_ago = null;
  this.agg_type = null;
  this.start_ts = null;
  this.end_ts = null;
  if (args) {
    if (args.type !== undefined && args.type !== null) {
      this.type = args.type;
    }
    if (args.key_ids !== undefined && args.key_ids !== null) {
      this.key_ids = Thrift.copyList(args.key_ids, [null]);
    }
    if (args.data !== undefined && args.data !== null) {
      this.data = Thrift.copyList(args.data, [ttypes.KeyData]);
    }
    if (args.min_ago !== undefined && args.min_ago !== null) {
      this.min_ago = args.min_ago;
    }
    if (args.agg_type !== undefined && args.agg_type !== null) {
      this.agg_type = args.agg_type;
    }
    if (args.start_ts !== undefined && args.start_ts !== null) {
      this.start_ts = args.start_ts;
    }
    if (args.end_ts !== undefined && args.end_ts !== null) {
      this.end_ts = args.end_ts;
    }
  }
};
Query.prototype = {};
Query.prototype.read = function(input) {
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
        this.type = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.LIST) {
        let _size0 = 0;
        var _rtmp34;
        this.key_ids = [];
        let _etype3 = 0;
        _rtmp34 = input.readListBegin();
        _etype3 = _rtmp34.etype;
        _size0 = _rtmp34.size;
        for (let _i5 = 0; _i5 < _size0; ++_i5) {
          let elem6 = null;
          elem6 = input.readI64();
          this.key_ids.push(elem6);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.LIST) {
        let _size7 = 0;
        var _rtmp311;
        this.data = [];
        let _etype10 = 0;
        _rtmp311 = input.readListBegin();
        _etype10 = _rtmp311.etype;
        _size7 = _rtmp311.size;
        for (let _i12 = 0; _i12 < _size7; ++_i12) {
          let elem13 = null;
          elem13 = new ttypes.KeyData();
          elem13.read(input);
          this.data.push(elem13);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.I32) {
        this.min_ago = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.STRING) {
        this.agg_type = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 10:
      if (ftype == Thrift.Type.I64) {
        this.start_ts = input.readI64();
      } else {
        input.skip(ftype);
      }
      break;
      case 11:
      if (ftype == Thrift.Type.I64) {
        this.end_ts = input.readI64();
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

Query.prototype.write = function(output) {
  output.writeStructBegin('Query');
  if (this.type !== null && this.type !== undefined) {
    output.writeFieldBegin('type', Thrift.Type.STRING, 1);
    output.writeString(this.type);
    output.writeFieldEnd();
  }
  if (this.key_ids !== null && this.key_ids !== undefined) {
    output.writeFieldBegin('key_ids', Thrift.Type.LIST, 2);
    output.writeListBegin(Thrift.Type.I64, this.key_ids.length);
    for (let iter14 in this.key_ids) {
      if (this.key_ids.hasOwnProperty(iter14)) {
        iter14 = this.key_ids[iter14];
        output.writeI64(iter14);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  if (this.data !== null && this.data !== undefined) {
    output.writeFieldBegin('data', Thrift.Type.LIST, 3);
    output.writeListBegin(Thrift.Type.STRUCT, this.data.length);
    for (let iter15 in this.data) {
      if (this.data.hasOwnProperty(iter15)) {
        iter15 = this.data[iter15];
        iter15.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  if (this.min_ago !== null && this.min_ago !== undefined) {
    output.writeFieldBegin('min_ago', Thrift.Type.I32, 4);
    output.writeI32(this.min_ago);
    output.writeFieldEnd();
  }
  if (this.agg_type !== null && this.agg_type !== undefined) {
    output.writeFieldBegin('agg_type', Thrift.Type.STRING, 5);
    output.writeString(this.agg_type);
    output.writeFieldEnd();
  }
  if (this.start_ts !== null && this.start_ts !== undefined) {
    output.writeFieldBegin('start_ts', Thrift.Type.I64, 10);
    output.writeI64(this.start_ts);
    output.writeFieldEnd();
  }
  if (this.end_ts !== null && this.end_ts !== undefined) {
    output.writeFieldBegin('end_ts', Thrift.Type.I64, 11);
    output.writeI64(this.end_ts);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

QueryRequest = module.exports.QueryRequest = function(args) {
  this.queries = null;
  if (args) {
    if (args.queries !== undefined && args.queries !== null) {
      this.queries = Thrift.copyList(args.queries, [ttypes.Query]);
    }
  }
};
QueryRequest.prototype = {};
QueryRequest.prototype.read = function(input) {
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
        let _size16 = 0;
        var _rtmp320;
        this.queries = [];
        let _etype19 = 0;
        _rtmp320 = input.readListBegin();
        _etype19 = _rtmp320.etype;
        _size16 = _rtmp320.size;
        for (let _i21 = 0; _i21 < _size16; ++_i21) {
          let elem22 = null;
          elem22 = new ttypes.Query();
          elem22.read(input);
          this.queries.push(elem22);
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

QueryRequest.prototype.write = function(output) {
  output.writeStructBegin('QueryRequest');
  if (this.queries !== null && this.queries !== undefined) {
    output.writeFieldBegin('queries', Thrift.Type.LIST, 1);
    output.writeListBegin(Thrift.Type.STRUCT, this.queries.length);
    for (let iter23 in this.queries) {
      if (this.queries.hasOwnProperty(iter23)) {
        iter23 = this.queries[iter23];
        iter23.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};
