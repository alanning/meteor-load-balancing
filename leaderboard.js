// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

if (Meteor.isClient) {
  Meteor.startup(function () {
    Meteor.call("getServerId", function (err, result) {
      if (err) {
        alert(err);
      } else {
        Session.set("serverId", result);
      }
    })
  });

  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.meta.serverId = function () {
    var serverId = Session.get("serverId");
    console.log('meta:serverId', serverId);
    return serverId;
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Meteor.call('adjustScore', 
                  Session.get("selected_player"),
                  5, 
                  function (err, result) {
                    if (err) {
                      alert(err);
                    }
                  })
    },
    'click input.serverId': function () {
      Meteor.call("getServerId", function (err, result) {
        if (err) {
          alert(err);
        } else {
          console.log("serverId", result);
        }
      })
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  var serverId = Meteor.uuid();
  console.log('serverId', serverId);

  Meteor.methods({
    getServerId: function () {
      console.log('client requesting server id...');
      return serverId;
    },
    adjustScore: function (playerId, amount) {
      console.log('client adjusting score');
      Players.update(playerId, {$inc: {score: amount}});
    }
  });

  Meteor.startup(function () {
    
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
  });
}
