import {render, screen} from '../test-utils'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import CreateNewBoardModal from '../components/forms/CreateNewBoardModal'

test('loads and displays new Board Modal', async () => {
  // ARRANGE
  render(<CreateNewBoardModal updateBoards={() => {}} isOpen={true} closeModal={() => {}} />)

  // ACT
  await userEvent.click(screen.getByLabelText("Board Title"))

  // ASSERT
  expect(screen.getByText('Submit')).toBeEnabled();
})
