import serverInfo from '../../package.json';

export const getServerVersion = () => {
    return serverInfo.version;
};
