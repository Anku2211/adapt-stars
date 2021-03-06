define(["backbone", "core/js/adapt", "./adapt-starsView"], function (
  Backbone,
  Adapt,
  StarsView
) {
  var questionComponents;
  var minimalUi = false;
  var isExternallyUpdated = false;
  var courseId;

  function initReview() {
    var Stars = Adapt.course.get("_stars");
    courseId = Adapt.config.get("_courseId");

    if (Stars && Stars._isEnabled) {
      // If stars is enabled - filter question components into a collection
      questionComponents = new Backbone.Collection(
        Adapt.components.where({ _isQuestionType: true })
      );
      if (Stars._minimalUi) {
        minimalUi = true;
      }
      if (Stars._isExternallyUpdated) {
        isExternallyUpdated = true;
      }

      // Only setup navigation event listener if stars is enabled
      setupNavigationEvent();
    }

    if (isExternallyUpdated) {
      var diffuseAssessment = Adapt.course.get("_diffuseAssessment");
      if (diffuseAssessment && diffuseAssessment._isEnabled === true) {
        Adapt.on(
          "diffuseAssessment:assessmentCalculate diffuseAssessment:assessmentComplete",
          function (assessment) {
            Adapt.trigger("stars:set", assessment._currentPoints);
          }
        );
      }
    }
  }

  function setupNavigationEvent() {
    Adapt.on("navigationView:postRender", function (navigationView) {
      console.log(navigationView);
      console.log(navigationView.el.lastChild);
      navInner = navigationView.el.lastChild;
      $(navInner).append(
        new StarsView({
          minimalUi: minimalUi,
          isExternallyUpdated: isExternallyUpdated,
          collection: questionComponents,
        }).$el
      );
    });
  }

  Adapt.on("adapt:start", initReview);
});
