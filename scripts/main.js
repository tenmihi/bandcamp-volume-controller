const INLINE_PLAYER_SELECTOR = '#trackInfoInner > div.inline_player > table > tbody'
const PLAY_CELL_SELECTOR = '#trackInfoInner > div.inline_player > table > tbody > tr:nth-child(1) > td.play_cell'

const CHROME_SYNC_STORAGE_KEY = 'bandcampVolume'

const createSliderControlls = () => {
  const $playerControls = $(INLINE_PLAYER_SELECTOR)
  if ($playerControls.length == 0) return;

  $(PLAY_CELL_SELECTOR).attr('rowspan', 3)

  const $tr = $('<tr>')
  $tr.appendTo($playerControls)

  const $td = $('<tr>', {
    class: 'volumecontrolextension_cell'
  })
  $td.appendTo($tr)

  const volumeIcon = `
  <span>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-volume">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 8a5 5 0 0 1 0 8" />
      <path d="M17.7 5a9 9 0 0 1 0 14" />
      <path
        d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
    </svg>
  </span>
  `
  const $icon = $(volumeIcon, {
    class: 'icon',
  })
  $icon.appendTo($td)

  const $slider = $('<div>', {
    class: 'slider',
  })
  $slider.appendTo($td)

  return $slider
}

const sliderValue2Volume = (val) => {
  return (val / 100.0) ** 2;
}

const init = () => {
  const $audioElements = $('audio');
  if ($audioElements.length == 0) return;

  $slider = createSliderControlls();

  chrome.storage.sync.get([CHROME_SYNC_STORAGE_KEY], (result) => {
    const savedVolume = result.bandcampVolume || 50;

    $slider.slider({
      range: "min",
      min: 0,
      max: 100,
      value: savedVolume,
      slide: (_, ui) => {
        const volume = sliderValue2Volume(ui.value)
        $audioElements.each(function () {
          $(this).prop('volume', volume);
        });
      },
      stop: (_, ui) => {
        chrome.storage.sync.set({ [CHROME_SYNC_STORAGE_KEY]: ui.value });
      }
    });
  });
};

init();