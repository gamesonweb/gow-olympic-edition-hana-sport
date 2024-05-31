// source: common.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global =
    (typeof globalThis !== 'undefined' && globalThis) ||
    (typeof window !== 'undefined' && window) ||
    (typeof global !== 'undefined' && global) ||
    (typeof self !== 'undefined' && self) ||
    (function () { return this; }).call(null) ||
    Function('return this')();

var google_protobuf_descriptor_pb = require('google-protobuf/google/protobuf/descriptor_pb.js');
goog.object.extend(proto, google_protobuf_descriptor_pb);
goog.exportSymbol('proto.kart.msgId', null, global);

/**
 * A tuple of {field number, class constructor} for the extension
 * field named `msgId`.
 * @type {!jspb.ExtensionFieldInfo<number>}
 */
proto.kart.msgId = new jspb.ExtensionFieldInfo(
    50010,
    {msgId: 0},
    null,
     /** @type {?function((boolean|undefined),!jspb.Message=): !Object} */ (
         null),
    0);

google_protobuf_descriptor_pb.MessageOptions.extensionsBinary[50010] = new jspb.ExtensionFieldBinaryInfo(
    proto.kart.msgId,
    jspb.BinaryReader.prototype.readUint32,
    jspb.BinaryWriter.prototype.writeUint32,
    undefined,
    undefined,
    false);
// This registers the extension field with the extended class, so that
// toObject() will function correctly.
google_protobuf_descriptor_pb.MessageOptions.extensions[50010] = proto.kart.msgId;

goog.object.extend(exports, proto.kart);
