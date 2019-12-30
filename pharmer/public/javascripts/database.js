$(document).ready(function () {
    getDatabaseList.then((result) => {
        drawDatabaseList(result).then(() => {
            $("#classification_paradigm").attr("disabled", false);
        })
    }).catch((err) => { console.error(err); })
});

// Get all present database.
var getDatabaseList = new Promise((resolve, reject) => {
    $.ajax({
        type: 'GET',
        url: document.location.protocol + "//" + document.location.hostname + ":" + document.location.port + "/database/list",
        success: (response) => {
            if (response['status'] === 'failed') {
                reject(response);
            }
            resolve(response);
        },
        error: (xhr, errmsg, err) => {
            console.log(xhr.status + ":" + xhr.responseText);
            reject(xhr);
        }
    });
});
var drawDatabaseList = function (response) {
    var promise = new Promise((resolve, reject) => {
        var db_options = '';
        response.forEach((database) => {
            db_options += '<option class="database_names" value="' + database.name + '">' + database.name + '</option>';
        });
        $("#database_select").empty();
        $("#database_select").html(db_options);
        $("#database_select").formSelect();
        $("#database_select").change(function (e) {
            getDatabaseFields($("#database_select").text());
        });
        $("#database_select").change();
        resolve(true);
    });
    return promise
}

// Cell values UI:
var drawCellValuesInjector = () => {
    var injector_html = '<div class="row cell-values-injector">'
        + '<div class="card">'
        + '<div class="card-content">'
        + '<div class="card-title">'
        + '<div class="row">'
        + '<div class="col l10 m10 s10">Cell Data</div>'
        + '<div class="col l2 m2 s2"><a class="waves-effect waves-light btn btn-small delete-cell-data-ui">X</a></div>'
        + '</div>'
        + '</div>'
        + '<div class="row">'
        + '<div class="input-field col l3 m3 s12">'
        + '<input type="text" class="tissue validate" required>'
        + '<label for="tissue">Tissue Name</label>'
        + '</div>'
        + '<div class="input-field col l3 m3 s12">'
        + '<input type="text" class="type validate" required>'
        + '<label for="type">Type</label>'
        + '</div>'
        + '<div class="input-field col l3 m3 s12">'
        + '<input type="text" class="subtype validate" required>'
        + '<label for="subtype">Subtype</label>'
        + '</div>'
        + '<div class="input-field col l3 m3 s12">'
        + '<input type="text" class="morphology validate" required>'
        + '<label for="morphology">Morphology</label>'
        + '</div>'
        + '<div class="file-field input-field col l12 m12 s12">'
        + '<div class="btn">'
        + '<span>File</span>'
        + '<input type="file" name="cell_values_file" class="cell-values-file" required>'
        + '</div>'
        + '<div class="file-path-wrapper">'
        + '<input class="file-path validate" type="text" placeholder="upload cell values file" required>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<div class="card-action">'
        + '<a class="send-cell-data">send</a>'
        + '</div>'
        + '</div>'
        + '</div>';
    $("#cell-values-form").append(injector_html);
    $(".delete-cell-data-ui").click(function(e) {
        this.closest(".cell-values-injector").remove();
    });
    $(".send-cell-data").click(function(e) {
        var data = this.closest(".cell-values-injector");
        var tissue = data.find(".tissue").val();
        var type = data.find(".type").val();
        var subtype = data.find(".subtype").val();
        var morphology = data.find(".morphology").val();
        var file = data.find(".cell-values-file")[0].files;
        send_cell_data(tissue, type, subtype, morphology, file);
    });
}
$("#add-cell-data").click(function() {
    drawCellValuesInjector();
});

// Send cell values to backend.
var send_cell_data = (tissue, type, subtype, morphology, file) => {
    var form_data = new FormData($("#cell-values-form").get(0));
    form_data.append("tissue", tissue);
    form_data.append("type", type);
    form_data.append("subtype", subtype);
    form_data.append("morphology", morphology);
    form_data.append("files", file);
    $.ajax({
        type: 'POST',
        url: document.location.protocol + "//" + document.location.hostname + ":" + document.location.port + "/database/cells",
        data: form_data,
        cache: false,
        processData: false,
        contentType: false,
        success: (response) => {
            console.log(response);
        },
        error: (xhr, errmsg, err) => {
            console.log(xhr.status + ":" + xhr.responseText);
        }
    });
}


var getDatabaseFields = (database) => {
    if (database !== "") {
        var form_data = new FormData($("#query-form").get(0));
        form_data.append("database", database);
        $.ajax({
            type: 'POST',
            url: document.location.protocol + "//" + document.location.hostname + ":" + document.location.port + "/database/fields",
            data: form_data,
            cache: false,
            processData: false,
            contentType: false,
            success: (response) => {
                var fields = '';
                $.each(response, (key, value) => {
                    fields += '<option value="' + key + '">' + key + '</option>';
                });
                $("#fields_select").empty();
                $("#fields_select").html(fields);
                $("#fields_select").formSelect();
            },
            error: (xhr, errmsg, err) => {
                console.log(xhr.status + ":" + xhr.responseText);
            }
        });
    } else {

    }
}

$("#send-files").click(function () {
    if ($('.invalid').length === 0) {
        var form_data = new FormData($("#file-form").get(0));
        form_data.append("files", [$("#descriptions")[0].files, $("#cell_values")[0].files, $("#go_terms")[0].files]);
        form_data.append("dbName", $("#database_name").val());
        $.ajax({
            type: "POST",
            url: document.location.protocol + "//" + document.location.hostname + ":" + document.location.port + "/database",
            data: form_data,
            cache: false,
            processData: false,
            contentType: false,
            success: (response) => {
                console.log(response);
            },
            error: (xhr, errmsg, err) => {
                console.log(xhr.status + ":" + xhr.responseText);
            }
        });
    } else {
        console.log('Please correct errors before upload!');
    }
});