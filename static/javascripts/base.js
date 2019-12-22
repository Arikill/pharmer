$(document).ready(function(){});
var ajaxSetup = () => {
    console.log("Setting up ajax");
    $.ajaxSetup({
        beforeSend: (xhr, settings) => {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRF-Token", $("#csrf_token").val());
            }
        }
    });
}; ajaxSetup();