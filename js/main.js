function api(long, lat) {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var formattedDate = moment(tomorrow).format('YYYY-MM-DD');
    formattedDate += "T12:00:00Z"
    //console.log("fdate",fdate)

    $.ajax({
        url: 'https://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/point/lon/16/lat/58/data.json',
        method: 'GET'
    })
        .done(function (result) {
            for (var i = 0; i < result.timeSeries.length; i++) {
                if (result.timeSeries[i].validTime.match(formattedDate)) {
                    console.log(result.timeSeries[i].validTime);
                    for (var j = 0; j < result.timeSeries[i].parameters.length; j++) {
                        if (result.timeSeries[i].parameters[j].unit === "Cel") {
                            console.log(`Temp: ${result.timeSeries[i].parameters[j].values} grader celcius`)
                        }
                    }
                }

            }
        })
        .fail(function (xhr, status, error) {
            console.log("Error", xhr, status, error);
            $("#errorDiv").html(`Error! ${xhr.responseJSON.Message}`);
        });
}

$(function () { api(); });