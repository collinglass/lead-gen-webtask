var graph = require('fbgraph');
var Promise = require("promise");

module.exports = function (ctx, done) {
  graph.setAccessToken("accessToken");
    var searchTerm = ctx.data.search || "";
    var searchOptions = {
      q:     searchTerm.replace("+"," ",-1),
      limit:  500,
      type:  "page"
  };

  graph.search(searchOptions, function(err, res) {
    var promises = [];
    for (var i = 0; i < res.data.length; i++) {
      var prom = new Promise(function(resolve, reject) {
        graph.get("/"+res.data[i].id, { fields: "name,emails,phone" }, function(err, res2) {
          resolve(res2);
        });
      });
      promises.push(prom);
    }

    Promise.all(promises).then(function(values) { done(null, values); });
  });
}
