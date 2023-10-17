const init = () => {
  const intro = document.querySelector('.intro');
  const app = document.querySelector('[data-id="app"]');

  const render = (markup) => {
    const renderList = (data, depth = 0) => {
      let output = '';
      
      if (data) {
        for (const [key, value] of Object.entries(data)) {
          if (typeof value === 'object' && value !== null) {
            output += depth ? '<li>' : '';
            output += `
              <details open>
                <summary class="name">${key}:</summary>
                  <ol>
                    ${renderList(value, depth + 1)}
                  </ol>
                </summary>
              </details>
            `;
            output += depth ? '</li>' : '';
          } else {
            output += `
              <li>
                <span class="name">${key}:</span>
                <span>${value}</span>
              </li>
            `;
          }
        }
      }

      
      return output;
    }

    app.insertAdjacentHTML('afterbegin', `
      <h1>${markup.title}</h1>
      ${renderList(markup.data)}
    `);
  };

  const load = () => {
    const $button = document.querySelector('[data-id="button"]');
    const $input = document.querySelector('[data-id="file"]');

    $input.addEventListener('change', function(e) {
      const file = e.target.files[0];
      $button.classList.add('-loading');
      if (!file) return;
    
      const reader = new FileReader();
      reader.addEventListener('load', e => {
        const content = e.target.result;

        try {
          const data = JSON.parse(content);
          render({
            title: file.name,
            data
          });
          intro.classList.add('-hide');
          $button.classList.remove('-loading');
        } catch (error) {
          $button.classList.remove('-loading');
          console.error(error);
          document.querySelector('.form').insertAdjacentHTML('beforeend', '<p>Invalid file. Please load a valid JSON file.</p>');
        }
      })

      reader.readAsText(file);
    });
  };

  load();
};

init();