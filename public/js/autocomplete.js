$(document).ready(function(){
  $('#member').keyup(function(){
    var sourceEndpoint = $(this).attr('data-source-endpoint');
    var targetEndpoint = $(this).attr('data-target-endpoint');
    var term = $(this).val();
    if (term.length > 0) {
      $('#members').html('');
      $.ajax({
        method: 'GET',
        url: sourceEndpoint + term,
        success: function(data){
          var result = '';
          data.forEach(function(member) {
            result += '<a class="btn btn-secondary btn-block text-left ajax" href="#"';
            result += ' data-method="put"';
            result += ' data-endpoint="' + targetEndpoint + member.id + '">';
            result += member.stagename;
            result += '</a>';
          });
          $('#members').html(result);
        }
      });
    }
  });
});
