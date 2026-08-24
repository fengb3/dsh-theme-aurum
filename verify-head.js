async page => {
  return await page.evaluate(() => {
    const card = document.querySelector('[data-composer-card]');
    const seats = [...document.querySelectorAll('.wSkVaW_composerSeat')];
    return {
      theme: document.body.getAttribute('data-ds-dark-theme') !== null ? 'dark' : 'light',
      composerBg: card ? getComputedStyle(card).backgroundColor : null,
      composerAlpha: card ? (match => match ? +match[1] : 1)(/\/\s*([\d.]+)\)$/.exec(getComputedStyle(card).backgroundColor)) : null,
      seatCount: seats.length,
      seatBgs: seats.map(s => getComputedStyle(s).backgroundImage === 'none' ? 'none' : getComputedStyle(s).backgroundImage.slice(0, 50)),
      bodyLayers: (getComputedStyle(document.body).backgroundImage.match(/radial-gradient/g) || []).length
    };
  });
}
