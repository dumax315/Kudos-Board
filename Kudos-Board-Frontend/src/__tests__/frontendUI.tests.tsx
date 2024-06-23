import { render, screen } from '../test-utils'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import CreateNewBoardModal from '../components/forms/CreateNewBoardModal'
import LogInModal from '../components/forms/LogInModal';
import RegisterModal from '../components/forms/RegisterModal';

const setupUser = (jsx: React.JSX.Element) => {
  return {
    user: userEvent.setup(),
    ...render(jsx)
  }
}

test('loads and displays new Board Modal', async () => {
  // ARRANGE
  render(<CreateNewBoardModal updateBoards={() => { }} isOpen={true} closeModal={() => { }} />)

  // ACT
  await userEvent.click(screen.getByLabelText("Board Title"))


  // ASSERT
  expect(screen.getByText('Submit')).toBeEnabled();
})

const userNumber = Math.floor(Math.random() * 100);

const userName = "newTestUser " + userNumber
const userEmail = `newTestUser ${userNumber}@test.com`
const password = `newTestUser${userNumber}Password`

test('loads, displays, and uses RegisterModal', async () => {
  let token: string | undefined = undefined;
  // ARRANGE
  const { user } = setupUser(<RegisterModal setToken={(newToken) => { token = newToken}} isOpen={true} closeModal={() => { console.log("modal closed")}} switchAuthAction={() => { }} />)

  // ACT
  await user.type(screen.getByLabelText("Name (public)"), userName)
  await user.type(screen.getByLabelText("Email"), userEmail)
  await user.type(screen.getByLabelText("Password"), password)

  expect(screen.getByText('Submit')).toBeEnabled();

  await user.click(screen.getByText('Submit'));

  // wait 1 seccond for the token to be set
  await new Promise((resolver) => {
    setTimeout(resolver, 1000);
  });
  console.log(token);
  // expect(token).toBeDefined();
})

test('loads, displays, and uses LogInModal', async () => {
  // ARRANGE
  render(<LogInModal setToken={() => { }} isOpen={true} closeModal={() => { }} switchAuthAction={() => { }} />)

  await screen.getByLabelText("Email");
  await screen.getByLabelText("Password");

  expect(screen.getByText('Submit')).toBeEnabled();
})
