import React, { useEffect, useState } from "react";
import { ClientJS } from "clientjs";

const TestPages = () => {
    const [deviceInfo, setDeviceInfo] = useState({});

    useEffect(() => {
        const client = new ClientJS();
        console.log(client);
        console.log(client.getCPU());
        console.log(client.getFingerprint());
        console.log(client.isChrome());
        setDeviceInfo({
            os: client.getOS(),
            browser: client.getBrowser(),
            screenResolution: client.getCurrentResolution(),
            fingerPrint: client.getFingerprint(),
            customFingerPrint: client.getCustomFingerprint(),
            cpu: client.getCPU(),
            deviceType: client.getDevice(),
            deviceVendor: client.getDeviceVendor(),
            deviceEngine: client.getEngine(),
            deviceEngineVersion: client.getEngineVersion(),
            softwareVersion: client.getSoftwareVersion(),
            silverLight: client.getSilverlightVersion(),
            getColorDepth: client.getColorDepth(),
            getOS: client.getOS(),
            getMimeTypes: client.getMimeTypes(),
            getPlugins: client.getPlugins(),
            getUserAgentLowerCase: client.getUserAgentLowerCase(),
            isChrome: client.isChrome(),
        });
    }, []);

    return (
        <div>
            <h1>Informasi Perangkat Pengguna:</h1>
            <p>Sistem Operasi: {deviceInfo.os}</p>
            <p>Browser: {deviceInfo.browser}</p>
            <p>Ukuran Layar: {deviceInfo.screenResolution}</p>
            <p>FingerPrint: {deviceInfo.fingerPrint}</p>
            <p>Custom FingerPrint: {deviceInfo.customFingerPrint}</p>
            <p>CPU: {deviceInfo.cpu}</p>
            <p>Device Type: {deviceInfo.deviceType}</p>
            <p>Device Engine: {deviceInfo.deviceEngine}</p>
            <p>Device Engine Version: {deviceInfo.deviceEngineVersion}</p>
            <p>Software Version: {deviceInfo.softwareVersion}</p>
            <p>getColorDepth: {deviceInfo.getColorDepth}</p>
            <p>getOS: {deviceInfo.getOS}</p>
            <p>getUserAgentLowerCase: {deviceInfo.getUserAgentLowerCase}</p>
            <p>getPlugins: {deviceInfo.getPlugins}</p>
            <p>getMimeTypes: {deviceInfo.getMimeTypes}</p>
            <p>isChrome: {deviceInfo.isChrome}</p>
        </div>
    );
};

export default TestPages;
