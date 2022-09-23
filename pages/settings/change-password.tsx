import type { NextPage } from 'next';

import Header from '../../components/Header';
import Wrapper from '../../components/Wrapper';
import Settings from '../../components/Settings';
import SettingsField from '../../components/Settings/SettingsField';
import Input from '../../components/Input';
import Button from '../../components/Button';

const ChangePasswordPage: NextPage = () => {
    return (
        <>
            <Header />
            <Wrapper>
                <div className="w-full max-w-2xl mt-4">
                    <Settings name="Change password">
                        <SettingsField name="Old password">
                            <Input type="password" name="old-password" />
                        </SettingsField>
                        <div className="mt-4">
                            <SettingsField name="New password">
                                <Input type="password" name="new-password" />
                            </SettingsField>
                        </div>
                        <div className="w-32 mt-4 sm:ml-36">
                            <Button>Submit</Button>
                        </div>
                    </Settings>
                </div>
            </Wrapper>
        </>
    );
};

export default ChangePasswordPage;