# Bootstrap - Datetime Picker

## Overview

Bootstrap date-time picker is a jQuery plugin developed for Bootstrap 3 for easy
and effective timestamp input collection. It simplifies the collection of valid
date and time for use in JavaScript Date objects, API interaction, and specifically
direct to SQL like timestamp and interval strings.


## Basic Usage

```html
<div class="form-group">
  <label for="datetime-input-example">Datetime</label>
  <input class="form-control" name="datetime-input-example" type="text" data-action="datetime-picker">
</div>
```

```js
$(function() {
  $('[data-action="datetime-picker"]').datetimePicker();
});
```
