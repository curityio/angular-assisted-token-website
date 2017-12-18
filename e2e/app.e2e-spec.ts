import { AssistedTokenPage } from './app.po';

describe('assisted-token App', () => {
  let page: AssistedTokenPage;

  beforeEach(() => {
    page = new AssistedTokenPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
