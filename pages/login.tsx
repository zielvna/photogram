import type { NextPage } from 'next';
import { RiCamera2Line } from 'react-icons/ri';

import Wrapper from '../components/Wrapper';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Link from '../components/Link';

const LogIn: NextPage = () => {
    return (
        <Wrapper>
            <div className="w-full max-w-xs mt-20">
                <Card>
                    <div className="flex justify-center">
                        <RiCamera2Line className="text-3xl text-black" />
                    </div>
                    <hr className="text-light-gray my-4" />
                    <form>
                        <Input type="email" name="email" placeholder="E-mail" spellCheck="false" />
                        <div className="mt-2">
                            <Input type="password" name="password" placeholder="Password" />
                        </div>
                        <div className="w-full mt-4">
                            <Button>Log in</Button>
                        </div>
                    </form>
                    <hr className="text-light-gray my-4" />
                    <div className="flex justify-center">
                        <p>
                            Don&apos;t have an account?{' '}
                            <Link className="text-blue font-bold" href="/signup">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </Wrapper>
    );
};

export default LogIn;
