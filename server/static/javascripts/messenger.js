var Messenger = function(address) {
    this.url = document.location.protocol + "//" + document.location.hostname + ":" + document.location.port + address;
}

Messenger.prototype.post = function(form_data, callback) {
    $.ajax({
        type: "POST",
        url: this.url,
        data: form_data,
        cache: false,
        processData: false,
        contentType: false,
        success: (response) => {
            console.log(response);
            callback(response);
        },
        error: (xhr, errmsg, err) => {
            console.log(xhr.status + ":" + xhr.responseText);
        }
    });
}

Messenger.prototype.get = function(callback) {
    $.ajax({
        type: "GET",
        url: this.url,
        success: (response) => {
            console.log(response);
            callback(response);
        },
        error: (xhr, errmsg, err) => {
            console.log(xhr.status + ":" + xhr.responseText);
        }
    });
}