fetch(window.location.href.replace(/commits.+/,
  "environments.json?nested=true&scope=active"
)).then(resp => resp.json())
  .then(json => {
    var envs = json.environments;
    console.log(envs);
    function makeLabels() {
      envs = envs.filter(env => {
        let deployment = env.latest.last_deployment;
        if (deployment) {
          let msg = deployment.commit.message.split("\n")[0];
          let elem = [...document.getElementsByClassName("gl-block")]
            .filter(x => x.innerText.startsWith(msg))[0];
          if (elem) {
            const newElem = document.createElement('a');
            newElem.textContent = env.latest.name;
            newElem.style = "background-color: #cc0000; color: white; padding: 3px 8px; border-radius: 10px; margin: 4px; font-weight: bold;"
            newElem.href = env.latest.environment_path;
            newElem.target = "_blank";
            elem.insertBefore(newElem, elem.querySelector("button"));
            return false; // remove from list
          }
        }
        return true; // keep in list (commit not there yet)
      });
    }
    makeLabels();
    new MutationObserver(makeLabels)
      .observe(document.getElementById("commits-list"), { childList: true, subtree: false });
  })
