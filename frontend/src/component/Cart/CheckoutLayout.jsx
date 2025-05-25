import { Outlet } from 'react-router'
import CheckoutSteps from './CheckoutSteps'

const CheckoutLayout = () => {
    return (
        <div className='w-full'>
            <CheckoutSteps />
            <div className='w-full flex justify-center'>
                <Outlet />
            </div>
        </div>
    )
}

export default CheckoutLayout