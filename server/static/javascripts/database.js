$(document).ready(function(){});

$("#send").click(function() {
    console.log("clicked");
    var messenger = new Messenger("/database");
    var form_data = new FormData($("#database-file-form").get(0));
    form_data.append("genes", $("#genes")[0].files[0]);
    form_data.append("cell-values", $("#cell-values")[0].files[0]);
    form_data.append("go-terms", $("#go-terms")[0].files[0]);
    messenger.post(form_data, console.log);
});