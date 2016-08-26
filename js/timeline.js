function Timeline(div) {
  var items = new vis.DataSet();
  var options = {
    width: '100%',
    height: '100%',
    selectable: false,
    editable: {
      add: false,
      updateTime: false,
      updateGroup: false,
      remove: false
    },
    throttleRedraw: 100
  };
  var timeline = new vis.Timeline(div, items, options);

  /* Query */
  const QUERY_ID = -1;
  timeline.on('click', function(e) {
    if (e.item === QUERY_ID) {
      items.remove(QUERY_ID);
    } else if (e.item === null) {
      items.update({
        id: QUERY_ID,
        start: e.time,
        content: '',
        type: 'box',
        className: 'query'
      });
    }
  });

  this.hasQuery = function() {
    return items.get(QUERY_ID) !== null;
  };

  this.getQuery = function() {
    return items.get(QUERY_ID).start.getTime();
  };

  /* Results */
  var resultIds = [];
  this.clearResults = function() {
    items.remove(resultIds);
    resultIds.length = 0;
  };

  this.addResult = function(videoId, time, thumbnail) {
    var contentString = '<img class="timeline-thumbnail" style="max-width: 30px;" src="' + thumbnail + '" onClick="showImage(' + videoId + ');" />';
    var color = '#' + scoreToHexColor(0);
    items.add({
      id: videoId,
      start: time,
      content: contentString,
      type: 'box',
      className: 'result',
      style: 'background-color: ' + color + ';'
    });
    resultIds.push(videoId);
  };

  this.setScore = function(videoId, score) {
    if (items.get(videoId) === null) {
      return; // Unknown item, ignore
    }
    var color = '#' + scoreToHexColor(score);
    items.update({ id: videoId, style: 'background-color: ' + color + ';' });
  };

  this.centerResults = function() {
    timeline.fit({ duration: 1000, easingFunction: 'easeInOutQuad' });
  };
}
