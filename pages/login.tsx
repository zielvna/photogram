import type { NextPage } from 'next';
import { RiCamera2Line } from 'react-icons/ri';

import Wrapper from '../components/Wrapper';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Link from '../components/Link';

const Login: NextPage = () => {
    return (
        <Wrapper>
            <Card className="mt-20">
                <div className="flex justify-center">
                    <RiCamera2Line className="text-3xl text-black" />
                </div>
                <hr className="text-light-gray my-4" />
                <form className="max-w-xs">
                    <Input type="email" name="email" placeholder="E-mail" spellCheck="false" />
                    <Input className="mt-2" type="password" name="password" placeholder="Password" />
                    <Button className="w-full mt-4">Log in</Button>
                </form>
                <hr className="text-light-gray my-4" />
                <div className="flex justify-center">
                    <p>
                        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
                    </p>
                </div>
            </Card>
        </Wrapper>
    );
};

export default Login;
