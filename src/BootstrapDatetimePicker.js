/**
 * DatetimePicker.js (for extends Datepicker Bootstrap)
 * Provides easy to use datetime and timestamp for bootstrap.
 * This description can span several lines and ends with a period.
 *
 * @link      https://github.com/airsciences/bootstrap-datetime
 */

+ (function($) {
  'use strict';

  var DatetimePicker = function(element, options) {
    /** Construct the datetime picker */
    var defaults = {
      showAll: true,
      showDate: false,
      showHours: false,
      showMinutes: false,
      showSeconds: false,
      showTimeZone: true,
      onChange: null,
      triggerHandler: true,
      validateBounds: true
    }
    this.options = $.extend(defaults, options);

    if (this.options.onChange !== null) {
      if (typeof this.options.onChange !== 'function') {
        throw TypeError("DatetimePicker: options.onChange must be a function.");
      }
    }

    this.element = $(element);
    this.datetime = this.isTimestamp(this.element.val())
      ? this.parseValue(this.element.val())
      : this.now();
  };

  DatetimePicker.prototype.show = function() {
    /** Convert the standard text input to a datetime type input. */
    var _this = this;
    var parent = this.element.parent();
    this.input_name = this.element.attr('name');

    var html = "<div class=\"form-inline\"> \
      <input data-datetime-part=\"hidden\" name=\"" + this.input_name + "\" type=\"hidden\">";

    if (this.options.showAll || this.options.showDate) {
      html += "<div class=\"input-group\" style=\"width: 31.5%; margin-bottom: 5px\"> \
        <div class=\"input-group-addon\">Date</div> \
        <input data-datetime-part=\"date\" data-provide=\"datepicker\" data-date-format=\"yyyy-mm-dd\" class=\"form-control\" type=\"text\" placeholder=\"Date\" value=\"" + this.datetime.date + "\"> \
      </div>";
    }

    if (this.options.showAll || this.options.showHours) {
      html += "<div class=\"input-group\" style=\"width: 20%; margin-bottom: 5px\"> \
        <div class=\"input-group-addon\">Hours</div> \
        <input data-datetime-part=\"hours\" class=\"form-control\" type=\"text\" placeholder=\"Hours\" value=\"" + this.datetime.hours + "\"> \
      </div>";
    }

    if (this.options.showAll || this.options.showMinutes) {
      html += "<div class=\"input-group\" style=\"width: 22.5%; margin-bottom: 5px\"> \
        <div class=\"input-group-addon\">Minutes</div> \
        <input data-datetime-part=\"minutes\"class=\"form-control\" type=\"text\" placeholder=\"Minutes\" value=\"" + this.datetime.minutes + "\"> \
      </div>";
    }

    if (this.options.showAll || this.options.showSeconds) {
      html += "<div class=\"input-group\" style=\"width: 22.5%; margin-bottom: 5px\"> \
        <div class=\"input-group-addon\">Seconds</div> \
        <input data-datetime-part=\"seconds\" class=\"form-control\" type=\"text\" placeholder=\"Seconds\" value=\"" + this.datetime.seconds + "\"> \
      </div>";
    }

    html += "</div>";
    this.element.replaceWith(html);

    /** Re-register element */
    this.element = parent;

    /** Sync the default data to the hidden input. */
    this.sync();

    /** Configure the onchange event. */
    this.element.on('change', function() {
      if (_this.options.validateBounds) {
        _this.validate();
      }
      _this.sync();
      if (_this.options.onChange !== null) {
        _this.options.onChange();
      }
    });
  };

  DatetimePicker.prototype.get = function() {
    var result = {
      "date": null,
      "hours": null,
      "minutes": null,
      "seconds": null
    };

    if (this.options.showAll || this.options.showDate) {
      result["date"] = this.element.find('[data-datetime-part="date"]').val();
    }

    if (this.options.showAll || this.options.showHours) {
      result["hours"] = this.element.find('[data-datetime-part="hours"]').val();
    }

    if (this.options.showAll || this.options.showMinutes) {
      result["minutes"] = this.element.find('[data-datetime-part="minutes"]').val();
    }

    if (this.options.showAll || this.options.showSeconds) {
      result["seconds"] = this.element.find('[data-datetime-part="seconds"]').val();
    }

    return result;
  };

  DatetimePicker.prototype.now = function() {
    /** Generates the current time array & sets this.datetime string object to that */
    return this.toJSON(new Date());
  };

  DatetimePicker.prototype.isTimestamp = function(value) {
    /** Tests if */
    var regex = new RegExp(/^\d{4}-\d{2}-\d{2}\ (\d{2}:){2}\d{2}$/);
    return regex.test(value);
  };

  DatetimePicker.prototype.parseValue = function(value) {
    /** If there's a value, parse it into a datetime */
    value = value.trim();
    var date = new Date(value.slice(0, 4), (parseInt(value.slice(5, 7)) - 1), value.slice(8, 10), value.slice(11, 13), value.slice(14, 16), value.slice(17, 19));
    return this.toJSON(date);
  };

  DatetimePicker.prototype.toJSON = function(date) {
    /** Converts to JSON */
    return {
      date: this.pad(date.getFullYear(), 4) + "-" + this.pad((date.getMonth() + 1), 2) + "-" + this.pad(date.getDate(), 2),
      hours: this.pad(date.getHours(), 2),
      minutes: this.pad(date.getMinutes(), 2),
      seconds: this.pad(date.getSeconds(), 2)
    };
  };

  DatetimePicker.prototype.validate = function() {
    /** Validate 0-60 range for hours, minutes, and seconds. */
    var min,
      max;
    var checks = this.get();

    for (var check in checks) {
      if (check == 'hours') {
        min = 0;
        max = 24;
      } else {
        min = 0;
        max = 60;
      }

      if (checks[check] > max) {
        this.element.find('[data-datetime-part="' + check + '"]').val(max);
      }
      if (checks[check] < min) {
        this.element.find('[data-datetime-part="' + check + '"]').val(min);
      }
    }
  };

  DatetimePicker.prototype.sync = function() {
    /** Sync to the hidden input */
    var value = this.get();

    var hours = (value.hours !== null)
      ? this.pad(value.hours, 2)
      : '00';
    var minutes = (value.minutes !== null)
      ? this.pad(value.minutes, 2)
      : '00';
    var seconds = (value.seconds !== null)
      ? this.pad(value.seconds, 2)
      : '00';

    var result_string = hours + ":" + minutes + ":" + seconds;

    if (this.options.showAll || this.options.showDate) {
      result_string = value.date + " " + result_string;
    }

    var hidden = this.element
      .find('[name="' + this.input_name + '"]').val(result_string);

    if (this.options.triggerHandler) {
      hidden.triggerHandler('change');
    }
  };

  DatetimePicker.prototype.pad = function(value, width) {
    /** Pad a Number with leading zeros if needed */
    var str = String(value);
    var zeros = '';

    if (str.length < width) {
      var offset = width - str.length;
      for (var i = 0; i < offset; i++) {
        zeros = zeros + '0';
      }
      str = zeros + str;
    }

    return str;
  };

  function Plugin(options) {
    return this.each(function() {
      /** Select existing 'DatetimePicker' from DOM $(this).data() */
      var data = $(this).data('DatetimePicker');

      if (typeof options !== 'undefined') {
        if (!data)
          $(this).data('DatetimePicker', (data = new DatetimePicker(this, options)));
        }
      else {
        if (!data)
          $(this).data('DatetimePicker', (data = new DatetimePicker(this)));
        }

      /** Show the Plugin */
      data.show();
    });
  }

  /** Get an existing datetimePicker already associated with jQuery ($)
   *  http://api.jquery.com/jQuery.fn.extend/ */
  var old = $.fn.datetimePicker;

  /** Register the Plugin & Constructor with jQuery ($) */
  $.fn.datetimePicker = Plugin;
  $.fn.datetimePicker.Constructor = DatetimePicker;

  /** Set the $.fn.datetimePicker to old if conflict */
  $.fn.datetimePicker.noConflict = function() {
    $.fn.datetimePicker = old;
    return this;
  };

}(jQuery));
