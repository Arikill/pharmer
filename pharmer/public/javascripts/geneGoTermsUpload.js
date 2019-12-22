$(document).ready({

});

var files = $("#files");
files.change(() => {
    sendFiles();
});

var sendFiles = () => {
    var formData = new FormData($("#file-upload-form").get(0));
    var fileData = files[0].files;
    console.log(fileData);
    formData.append("files", fileData);
    $.ajax({
        type: "POST",
        url: document.location.protocol + "//" + document.location.hostname + ":" + document.location.port + "/transcriptome/database/upload/geneGoTerms",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        success: (response) => {
            console.log(response);
        },
        error: (xhr, errmsg, err) => {
            console.log(xhr.status + ":" + xhr.responseText);
            console.log(err);
            console.log(errmsg);
        }
    });
}