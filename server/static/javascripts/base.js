$(document).ready(function () { 
    ajaxSetup();
});
var ajaxSetup = () => {
    console.log("Setting up ajax");
    $.ajaxSetup({
        beforeSend: (xhr, settings) => {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", $("#csrf-token").val());
            }
        }
    });
}