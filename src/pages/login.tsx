import type { NextPage } from 'next';
import { LogIn } from '../components/LogIn';
import { Progress } from '../components/Progress';
import { PublicRoute } from '../components/PublicRoute';
import { Wrapper } from '../components/Wrapper';

const LogInPage: NextPage = () => (
    <PublicRoute>
        <Progress />
        <Wrapper>
            <div className="w-full max-w-xs mt-20">
                <LogIn />
            </div>
        </Wrapper>
    </PublicRoute>
);

export default LogInPage;
