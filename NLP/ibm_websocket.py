import websocket
import json
import pandas as pd
#from simplify import simplify
from extraction import summary

paragraph = ""

def clean(dt):
    sum = ""
    column_names=['transcript','confidence']
    df=pd.DataFrame(columns=column_names)

    for result in dt['results']:
        trans=result['alternatives'][0]['transcript']
        con=result['alternatives'][0]['confidence']
        sum += trans
        df=df.append({'transcript':trans,'confidence':con},ignore_index=True)

    return df,sum


def on_message(self,message):
    print("maessage: ", message)
    print("type: ", type(message))
    if message == "done":
        print("working here")
        file = open("summary.txt", "r")
        summary_end = summary(file.read())
        self.send(summary_end)
        print("Summary: ", summary_end)
        file.close()
    else:
        try:
            message = json.loads(message)

            test, trans = clean(message)

            file = open("summary.txt", "a")
            trans = trans.replace("%HESITATION", "")
            file.write(trans + "\n")

            output = trans
            #output = simplify([output])
            self.send(output)

            print("sent the message: %s" % (output))
            # #send message back
        except:
            print("ure dumb")

def on_error(error):
    print(error)

def on_close(self):

    self.close()

    # print("sent summary ", summary_end)
    print("### closed ###")

def on_open(self):
    self.send(json.dumps({'clientType':'ibm','msg':'HI ITS WILL'}))

#connection to server
if __name__ == "__main__":
  websocket.enableTrace(True)
  ws = websocket.WebSocketApp('ws://736254919d44.ngrok.io/ws',
                            on_message = on_message,
                            on_error = on_error,
                            on_close = on_close)
  ws.on_open = on_open
  ws.run_forever()

