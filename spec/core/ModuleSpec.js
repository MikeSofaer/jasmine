describe('Suite', function() {
  var fakeTimer;
  var env;

  beforeEach(function() {
    env = new jasmine.Env();
    env.updateInterval = 0;

    fakeTimer = new jasmine.FakeTimer();
    env.setTimeout = fakeTimer.setTimeout;
    env.clearTimeout = fakeTimer.clearTimeout;
    env.setInterval = fakeTimer.setInterval;
    env.clearInterval = fakeTimer.clearInterval;
  });

  describe('Modules', function () {
      describe("when there is no module loader", function(){
          beforeEach(function() {
              this.suite = env.describe(["module"], function () {
                  env.it('trivial it', function() {
                      this.expect(true).toEqual(true);
                  });
              });
          });
          it("should fail", function(){
            env.execute();
            var result = this.suite.specs()[0].results().getItems()[0];
            expect(result.passed()).toEqual(false);
            expect(result.message).toEqual("You can't test a module without define.amd set on the global object");
          });
      });
      describe("when there is a module loader", function(){
          var o_require, o_define;
          beforeEach(function() {
              jasmine.getGlobal().define = {amd: true};
              jasmine.getGlobal().require = function(modules, callback){
                var fakeModules = [6, 7];
                callback.call(undefined, fakeModules);
              }

              this.suite = env.describe(["six", "seven"], function (six, seven) {
                  env.it('gets the modules', function() {
                      this.expect(six).toEqual(6);
                      this.expect(seven).toEqual(7);
                  });
              });
          });
          afterEach(function(){
            jasmine.getGlobal.define = o_define;
            jasmine.getGlobal.require = o_require;
          });
          it("should pass", function(){
            env.execute();
            var result = this.suite.specs()[0].results().getItems()[0];
            expect(result.passed()).toEqual(true);
            expect(result.message).toEqual("Passed.");
          })

      })
  });
});

