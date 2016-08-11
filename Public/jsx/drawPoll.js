function drawPoll(poll) {
    console.log('drawing a poll');
    var polls = {
        updatePie: updatePie
    }
    var pieDim ={w:250, h: 250};
    var votes = [];
    var piesvg = d3.select('#pie').append('svg')
        .attr('height', '400')
        .attr('width', '500')
        .append('g')
        .attr('transform', 'translate('+pieDim.w/2+','+pieDim.h/2+')');
    var arc = d3.arc().outerRadius(pieDim.w/2 - 10).innerRadius(0);
    var pie = d3.pie().value(function(d) {return d});
    var colors = d3.scaleOrdinal(d3.schemeCategory10)
    function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    }
    
    
    function updatePie(poll) {
        votes = poll.polls.map(function(data) {
            return data.peopleVoted;
        })
        console.log(votes);
        var pies = piesvg.selectAll("path").data(pie(votes));
        var legend = piesvg.selectAll('g').data(poll.polls);
        
        pies.enter().append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d, i) { return colors(i)});
        
        pies.exit().remove();
            
        pies.transition().duration(750).attrTween('d', arcTween)
        
        var legendItemAdd = legend.enter().append('g')
            .attr('class', 'legendItem')
            .attr('transform', function(d, i) {
                return 'translate('+(pieDim.w-100)+','+(15*i-100)+')';
            });
        
        legend.exit().remove();
            
        legendItemAdd.append('rect')
                .attr('width', 10)
                .attr('height', 10)
                .attr('x', 0)
                .attr('y', 0)
                .attr('fill', function(d, i) { return colors(i)});
                
        legendItemAdd.append('text')
                .text(function(d) {
                    return d.value;
                })
                .attr('transform', 'translate(15, 10)')
                
        d3.selectAll('.legendItem').data(poll.polls).select('text').text(function(d, i) {
            var sum = votes.reduce(function(prev, curr) {
                return prev+curr;
                });
            var percent = (d.peopleVoted/sum*100).toFixed(1)
            if(percent == 'NaN') {
                percent = '0.00';
            }
            return d.value + ' - ' + d.peopleVoted +'  ('+percent+'%)'
        });
    }
    return polls;
}

module.exports = drawPoll;