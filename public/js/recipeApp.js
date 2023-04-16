$(document).ready(() => {
    $("#modal-button").click(() => {
      $(".modal-body").html('');
      $.get("/courses?format=json", (data) => {
        data.forEach((course) => {
          $(".modal-body").append(
            `<div class="course-container">
              <span class="course-title">
                Title:
              </span>
              <span class="course-title-value">
                ${course.title}
              </span>
              <div class="course-description">
                Description:
              </div>
              <div class="course-description-value">
                ${course.description}
              </div>
            </div>`
          );
        });
      });
    });
  });
  