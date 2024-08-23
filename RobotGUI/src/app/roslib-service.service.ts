import { Injectable } from '@angular/core';
import * as ROSLIB from 'roslib';
import { Subject, Observable } from 'rxjs';

// Adjust the type definition to match what `ros.getTopics` returns
interface RosTopics {
  topics: string[];
  types: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RoslibService {
  private _ros: ROSLIB.Ros;
  private _connected = new Subject<boolean>();
  private _topics: { [key: string]: Subject<any> } = {};

  constructor() {
    this._connected.next(false);

    this._ros = new ROSLIB.Ros({});
    this._ros.connect('ws://localhost:9090');
    this._ros.on('connection', () => {
      this._connected.next(true);
    });
    // TODO: Manage the events "disconnect" and "error".
  }

  get connected(): Observable<boolean> {
    return this._connected.asObservable();
  }

  subscribeToTopic(topicName: string): Observable<any> {
    if (!this._topics[topicName]) {
      this._topics[topicName] = new Subject<any>();

      // Discover the topic details, including the message type
      this._ros.getTopics((result: RosTopics) => {
        const topicIndex = result.topics.indexOf(topicName);
        if (topicIndex !== -1) {
          const messageType = result.types[topicIndex];
          if (messageType) {
            const topic = new ROSLIB.Topic({
              ros: this._ros,
              name: topicName,
              messageType: messageType
            });

            topic.subscribe((msg: ROSLIB.Message) => {
              this._topics[topicName].next(msg);
            });
          } else {
            console.error(`Message type for topic ${topicName} could not be determined.`);
          }
        } else {
          console.error(`Topic ${topicName} not found.`);
        }
      });
    }

    return this._topics[topicName].asObservable();
  }
}
