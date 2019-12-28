$(document).ready(function(){
    $('.sidenav').sidenav();
  });
var ajaxSetup = () => {
    console.log("Setting up ajax");
    $.ajaxSetup({
        beforeSend: (xhr, settings) => {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRF-Token", $("#csrfToken").val());
            }
        }
    });
}; ajaxSetup();