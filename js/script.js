//essential variables
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    aniId;

//parameters
var w = canvas.width = window.innerWidth - 230,
    h = canvas.height = window.innerHeight,
    particles = [], //particle array
    level = 50,
    maxLts = 500,
    minLts = 10,
    currentLts = 300,
    lowLevelLts = 30,
    highLevelLts = 440,
    fill = false,
    color = "#34A7C1",
    c;

$(document).ready(function () {
    $(".positive-integer").numeric(
        { decimal: false, negative: false },
        function () {
            //
        }
    );

    $("#txtTankLevel").attr({
        "max": maxLts,
        "min": minLts
    });
    $("#txtTankLevel").val(currentLts);
    $("#txtTankLevelManual").val(currentLts);
    $("#txtMaximumLevel").val(maxLts);
    $("#txtMinimumLevel").val(minLts);
    $("#txtAlarmHigh").val(highLevelLts);
    $("#txtLowLevel").val(lowLevelLts);
    calculatePercentage();
});

//Particle object constructor
function particle(x, y, d) {
    this.x = x;
    this.y = y;
    this.d = d;
    this.respawn = function () {
        this.x = Math.random() * (w * 0.8) + (0.1 * w);
        this.y = Math.random() * 30 + h - (h - 100) * level / 100 - 50 + 50;
        this.d = Math.random() * 5 + 5;
    };
}

//function to start or restart the animation
function init() {
    c = 0;
    particles = [];
    for (var i = 0; i < 40; i++) {
        var obj = new particle(0, 0, 0);
        obj.respawn();
        particles.push(obj);
    }
    aniId = window.requestAnimationFrame(draw);
}

//function that draws into the canvas in a loop
function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    //draw the liquid
    ctx.beginPath();
    ctx.moveTo(w, h - (h - 100) * level / 100 - 50);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.lineTo(0, h - (h - 100) * level / 100 - 50);
    var temp = (50 * Math.sin(c * 1 / 50));
    ctx.bezierCurveTo((w / 3), h - (h - 100) * level / 100 - 50 - temp,
        (2 * w / 3), h - (h - 100) * level / 100 - 50 + temp,
        w, h - (h - 100) * level / 100 - 50);
    ctx.fill();

    //draw the bubbles
    for (var i = 0; i < 40; i++) {
        ctx.beginPath();
        ctx.arc(particles[i].x, particles[i].y, particles[i].d, 0, 2 * Math.PI);
        if (fill)
            ctx.fill();
        else
            ctx.stroke();
    }

    update();
    aniId = window.requestAnimationFrame(draw);
}

//function that updates variables
function update() {
    c++;
    if (100 * Math.PI <= c)
        c = 0;
    for (var i = 0; i < 40; i++) {
        particles[i].x = particles[i].x + Math.random() * 2 - 1;
        particles[i].y = particles[i].y - 1;
        particles[i].d = particles[i].d - 0.04;
        if (particles[i].d <= 0)
            particles[i].respawn();
    }
}

//update canvas size when resizing the window
window.addEventListener('resize', function () {
    //update the size
    w = canvas.width = window.innerWidth - 230;
    h = canvas.height = window.innerHeight;
    //stop the animation befor restarting it
    window.cancelAnimationFrame(aniId);
    init();
});

//start animation
init();

function calculatePercentage() {
    level = Math.round((currentLts * 100) / maxLts);

    // Alarm Control
    if (currentLts >= highLevelLts) {
        $("#tanque_image").attr("src", "images/tanque_alto.jpg");
        color = "tomato";
    } else if (currentLts <= lowLevelLts) {
        $("#tanque_image").attr("src", "images/tanque_bajo.jpg");
        color = "#FFC90E";
    } else {
        $("#tanque_image").attr("src", "images/tanque_normal.jpg");
        color = "#34A7C1";
    }
}

// Button controls

$('.btn-number').click(function (e) {
    e.preventDefault();

    fieldName = $(this).attr('data-field');
    type = $(this).attr('data-type');

    var input = $("input[name='" + fieldName + "']");
    currentLts = parseInt(input.val());

    if (!isNaN(currentLts)) {
        if (type == 'minus') {

            if (currentLts > minLts) {
                input.val(currentLts - 1).change();
                $("#txtTankLevelManual").val(currentLts);
                calculatePercentage();
            }
            if (parseInt(input.val()) == minLts) {
                $(this).attr('disabled', true);
            }

        } else if (type == 'plus') {

            if (currentLts < maxLts) {
                input.val(currentLts + 1).change();
                $("#txtTankLevelManual").val(currentLts);
                calculatePercentage();
            }
            if (parseInt(input.val()) == maxLts) {
                $(this).attr('disabled', true);
            }

        }
    } else {
        input.val(0);
        calculatePercentage();
    }
});

$('#btnSetTankLevel').click(function (e) {
    e.preventDefault();

    var inputLts = parseInt($("#txtTankLevelManual").val());

    if (inputLts < minLts || inputLts > maxLts) {
        $("#txtTankLevelManual").focus();
        alert("This value cannot be defined as it is out of bounds.");
    } else {
        currentLts = inputLts;
        $("#txtTankLevel").val(currentLts);
        calculatePercentage();
    }
});

$('.input-number').focusin(function () {
    $(this).data('oldValue', $(this).val());
});

$('.input-number').change(function () {
    minLts = parseInt($(this).attr('min'));
    maxLts = parseInt($(this).attr('max'));
    currentLts = parseInt($(this).val());

    name = $(this).attr('name');

    if (currentLts >= minLts) {
        $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
    } else {
        alert('The minimum value was reached');
        $(this).val($(this).data('oldValue'));
    }

    if (currentLts <= maxLts) {
        $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
    } else {
        alert('The maximum value was reached');
        $(this).val($(this).data('oldValue'));
    }
});

$('#btnEditSetup').click(function (e) {
    e.preventDefault();
    $("#txtMaximumLevel").prop("disabled", false);
    $("#txtMinimumLevel").prop("disabled", false);
    $("#txtAlarmHigh").prop("disabled", false);
    $("#txtLowLevel").prop("disabled", false);

    $('#btnEditSetup').prop("disabled", true);
    $('#btnCancelSetup').prop("disabled", false);
    $('#btnSaveSetup').prop("disabled", false);
});

$('#btnCancelSetup').click(function (e) {
    e.preventDefault();
    $("#txtMaximumLevel").val(maxLts);
    $("#txtMinimumLevel").val(minLts);
    $("#txtAlarmHigh").val(highLevelLts);
    $("#txtLowLevel").val(lowLevelLts);

    $("#txtMaximumLevel").prop("disabled", true);
    $("#txtMinimumLevel").prop("disabled", true);
    $("#txtAlarmHigh").prop("disabled", true);
    $("#txtLowLevel").prop("disabled", true);

    $('#btnEditSetup').prop("disabled", false);
    $('#btnCancelSetup').prop("disabled", true);
    $('#btnSaveSetup').prop("disabled", true);
});

$('#btnSaveSetup').click(function (e) {
    e.preventDefault();

    if (parseInt($("#txtMaximumLevel").val()) < parseInt($("#txtMinimumLevel").val())) {
        return alert("The maximum value of the tank must be greater than the minimum value.");
    }

    if (parseInt($("#txtAlarmHigh").val()) < parseInt($("#txtLowLevel").val())) {
        return alert("The high alert value must be greater than the low alert value.");
    }

    if (currentLts > parseInt($("#txtMaximumLevel").val()) || currentLts < parseInt($("#txtMinimumLevel").val())) {
        return alert("The current value of the tank is outside the established limits. Please reduce or increase the tank capacity first in order to set the new limits.");
    }

    if (parseInt($("#txtAlarmHigh").val()) > maxLts || parseInt($("#txtLowLevel").val()) < minLts) {
        return alert("The values entered for the alerts are outside the limits of the maximum or minimum values of the deposit.");
    }

    if (parseInt($("#txtAlarmHigh").val()) > parseInt($("#txtMaximumLevel").val()) ||
        parseInt($("#txtLowLevel").val()) < parseInt($("#txtMinimumLevel").val())) {
        return alert("Values entered between upper and lower limits and high and low level alerts are inconsistent. Please check that the alert values are within the range of the tank limit values.");
    }

    maxLts = $("#txtMaximumLevel").val();
    minLts = $("#txtMinimumLevel").val();
    highLevelLts = $("#txtAlarmHigh").val();
    lowLevelLts = $("#txtLowLevel").val();

    $("#txtMaximumLevel").prop("disabled", true);
    $("#txtMinimumLevel").prop("disabled", true);
    $("#txtAlarmHigh").prop("disabled", true);
    $("#txtLowLevel").prop("disabled", true);

    $('#btnEditSetup').prop("disabled", false);
    $('#btnCancelSetup').prop("disabled", true);
    $('#btnSaveSetup').prop("disabled", true);
});


$('#btnEmptyTank').click(function (e) {
    e.preventDefault();
    if (confirm('Do you wish to empty the tank?')) {
        level = 0;
        currentLts = minLts;
        $("#txtTankLevelManual").val(currentLts);
        $("#txtTankLevel").val(currentLts);
        calculatePercentage();
      }
});