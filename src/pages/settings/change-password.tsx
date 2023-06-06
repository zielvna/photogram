import type { NextPage } from 'next';
import { ChangePassword } from '../../components/ChangePassword';
import { Header } from '../../components/Header';
import { PrivateRoute } from '../../components/PrivateRoute';
import { Progress } from '../../components/Progress';
import { Wrapper } from '../../components/Wrapper';

const ChangePasswordPage: NextPage = () => (
    <PrivateRoute>
        <Progress />
        <Header />
        <Wrapper>
            <div className="w-full max-w-2xl mt-4">
                <ChangePassword />
            </div>
        </Wrapper>
    </PrivateRoute>
);

export default ChangePasswordPage;
