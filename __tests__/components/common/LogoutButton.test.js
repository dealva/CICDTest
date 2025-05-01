
import { render , screen , fireEvent , waitFor } from "@testing-library/react"
import LogoutButton from "@/components/common/LogoutButton"
import { signOut } from 'next-auth/react';
jest.mock('next-auth/react', () => ({
    signOut: jest.fn(),
}));
  
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: pushMock,
      refresh: pushMock,
    }),
}))
describe('LogoutButton',() => {
    it('should be able to render correctly', ()=>{
        render(<LogoutButton />)
        expect(screen.getByText('Logout')).toBeInTheDocument()
    })
    it('should call signOut and redirect when clicked', async () => {
        signOut.mockResolvedValue({});
        render(<LogoutButton />);
        const button = screen.getByRole('button');
    
        fireEvent.click(button);
    
        // wait for the promises to resolve in handleLogout
        await waitFor(() => {
            expect(signOut).toHaveBeenCalledWith({ redirect: false });
            expect(pushMock).toHaveBeenCalledWith('/login');
          });
      });
})
