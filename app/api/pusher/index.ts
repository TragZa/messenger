const Pusher = require("pusher");

const pusher = new Pusher({
    appId: process.env.app_id,
    key: process.env.key,
    secret: process.env.secret,
    cluster: process.env.cluster,
    useTLS: true,
  });

pusher.trigger("my-channel", "my-event", {
  message: "hello world"
});