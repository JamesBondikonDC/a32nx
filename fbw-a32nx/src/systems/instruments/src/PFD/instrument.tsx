import { DisplayManagementComputer } from 'instruments/src/PFD/shared/DisplayManagementComputer';
import { Clock, FSComponent, EventBus, HEventPublisher } from 'msfssdk';
import { getDisplayIndex, PFDComponent } from './PFD';
import { AdirsValueProvider } from '../MsfsAvionicsCommon/AdirsValueProvider';
import { ArincValueProvider } from './shared/ArincValueProvider';
import { PFDSimvarPublisher, PFDSimvars } from './shared/PFDSimvarPublisher';
import { SimplaneValueProvider } from './shared/SimplaneValueProvider';

import './style.scss';

class A32NX_PFD extends BaseInstrument {
    private bus: EventBus;

    private simVarPublisher: PFDSimvarPublisher;

    private readonly hEventPublisher;

    private readonly arincProvider: ArincValueProvider;

    private readonly simplaneValueProvider: SimplaneValueProvider;

    private readonly clock: Clock;

    private adirsValueProvider: AdirsValueProvider<PFDSimvars>;

    private readonly displayManagementComputer: DisplayManagementComputer;

    /**
     * "mainmenu" = 0
     * "loading" = 1
     * "briefing" = 2
     * "ingame" = 3
     */
    private gameState = 0;

    constructor() {
        super();
        this.bus = new EventBus();
        this.simVarPublisher = new PFDSimvarPublisher(this.bus);
        this.hEventPublisher = new HEventPublisher(this.bus);
        this.arincProvider = new ArincValueProvider(this.bus);
        this.simplaneValueProvider = new SimplaneValueProvider(this.bus);
        this.clock = new Clock(this.bus);
        this.displayManagementComputer = new DisplayManagementComputer(this.bus);
    }

    get templateID(): string {
        return 'A32NX_PFD';
    }

    public getDeltaTime() {
        return this.deltaTime;
    }

    public onInteractionEvent(args: string[]): void {
        this.hEventPublisher.dispatchHEvent(args[0]);
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.adirsValueProvider = new AdirsValueProvider(this.bus, this.simVarPublisher, getDisplayIndex() === 1 ? 'L' : 'R');

        this.arincProvider.init();
        this.clock.init();
        this.displayManagementComputer.init();

        this.simVarPublisher.subscribe('elec');
        this.simVarPublisher.subscribe('elecFo');

        this.simVarPublisher.subscribe('coldDark');
        this.simVarPublisher.subscribe('potentiometerCaptain');
        this.simVarPublisher.subscribe('potentiometerFo');
        this.simVarPublisher.subscribe('pitch');
        this.simVarPublisher.subscribe('roll');
        this.simVarPublisher.subscribe('magHeadingRaw');
        this.simVarPublisher.subscribe('baroCorrectedAltitude');
        this.simVarPublisher.subscribe('speed');
        this.simVarPublisher.subscribe('noseGearCompressed');
        this.simVarPublisher.subscribe('leftMainGearCompressed');
        this.simVarPublisher.subscribe('rightMainGearCompressed');
        this.simVarPublisher.subscribe('activeLateralMode');
        this.simVarPublisher.subscribe('activeVerticalMode');
        this.simVarPublisher.subscribe('fmaModeReversion');
        this.simVarPublisher.subscribe('fmaSpeedProtection');
        this.simVarPublisher.subscribe('AThrMode');
        this.simVarPublisher.subscribe('apVsSelected');
        this.simVarPublisher.subscribe('approachCapability');
        this.simVarPublisher.subscribe('ap1Active');
        this.simVarPublisher.subscribe('ap2Active');
        this.simVarPublisher.subscribe('fmaVerticalArmed');
        this.simVarPublisher.subscribe('fmaLateralArmed');
        this.simVarPublisher.subscribe('fd1Active');
        this.simVarPublisher.subscribe('fd2Active');
        this.simVarPublisher.subscribe('athrStatus');
        this.simVarPublisher.subscribe('athrModeMessage');
        this.simVarPublisher.subscribe('machPreselVal');
        this.simVarPublisher.subscribe('speedPreselVal');
        this.simVarPublisher.subscribe('mda');
        this.simVarPublisher.subscribe('dh');
        this.simVarPublisher.subscribe('attHdgKnob');
        this.simVarPublisher.subscribe('airKnob');
        this.simVarPublisher.subscribe('vsBaro');
        this.simVarPublisher.subscribe('vsInert');
        this.simVarPublisher.subscribe('fdYawCommand');
        this.simVarPublisher.subscribe('fdBank');
        this.simVarPublisher.subscribe('fdPitch');
        this.simVarPublisher.subscribe('hasLoc');
        this.simVarPublisher.subscribe('hasDme');
        this.simVarPublisher.subscribe('navIdent');
        this.simVarPublisher.subscribe('navFreq');
        this.simVarPublisher.subscribe('dme');
        this.simVarPublisher.subscribe('navRadialError');
        this.simVarPublisher.subscribe('hasGlideslope');
        this.simVarPublisher.subscribe('glideSlopeError');
        this.simVarPublisher.subscribe('markerBeacon');
        this.simVarPublisher.subscribe('v1');
        this.simVarPublisher.subscribe('fwcFlightPhase');
        this.simVarPublisher.subscribe('fmgcFlightPhase');

        this.simVarPublisher.subscribe('vr');

        this.simVarPublisher.subscribe('isAltManaged');

        this.simVarPublisher.subscribe('mach');
        this.simVarPublisher.subscribe('flapHandleIndex');

        this.simVarPublisher.subscribe('transAlt');
        this.simVarPublisher.subscribe('transAltAppr');

        this.simVarPublisher.subscribe('magTrackRaw');
        this.simVarPublisher.subscribe('selectedHeading');
        this.simVarPublisher.subscribe('showSelectedHeading');
        this.simVarPublisher.subscribe('altConstraint');
        this.simVarPublisher.subscribe('trkFpaActive');
        this.simVarPublisher.subscribe('aoa');

        this.simVarPublisher.subscribe('selectedFpa');
        this.simVarPublisher.subscribe('targetSpeedManaged');
        this.simVarPublisher.subscribe('ilsCourse');
        this.simVarPublisher.subscribe('ilsRMPTuned');
        this.simVarPublisher.subscribe('tla1');
        this.simVarPublisher.subscribe('tla2');
        this.simVarPublisher.subscribe('metricAltToggle');
        this.simVarPublisher.subscribe('landingElevation');

        this.simVarPublisher.subscribe('tcasState');
        this.simVarPublisher.subscribe('tcasCorrective');
        this.simVarPublisher.subscribe('tcasRedZoneL');
        this.simVarPublisher.subscribe('tcasRedZoneH');
        this.simVarPublisher.subscribe('tcasGreenZoneL');
        this.simVarPublisher.subscribe('tcasGreenZoneH');
        this.simVarPublisher.subscribe('tcasFail');
        this.simVarPublisher.subscribe('engOneRunning');
        this.simVarPublisher.subscribe('engTwoRunning');
        this.simVarPublisher.subscribe('expediteMode');
        this.simVarPublisher.subscribe('setHoldSpeed');
        this.simVarPublisher.subscribe('trkFpaDeselectedTCAS');
        this.simVarPublisher.subscribe('tcasRaInhibited');
        this.simVarPublisher.subscribe('groundSpeed');
        this.simVarPublisher.subscribe('radioAltitude1');
        this.simVarPublisher.subscribe('radioAltitude2');

        this.simVarPublisher.subscribe('crzAltMode');
        this.simVarPublisher.subscribe('tcasModeDisarmed');
        this.simVarPublisher.subscribe('flexTemp');
        this.simVarPublisher.subscribe('autoBrakeMode');
        this.simVarPublisher.subscribe('autoBrakeActive');
        this.simVarPublisher.subscribe('autoBrakeDecel');
        this.simVarPublisher.subscribe('fpaRaw');
        this.simVarPublisher.subscribe('daRaw');
        this.simVarPublisher.subscribe('latAccRaw');
        this.simVarPublisher.subscribe('ls1Button');
        this.simVarPublisher.subscribe('ls2Button');
        this.simVarPublisher.subscribe('xtk');
        this.simVarPublisher.subscribe('ldevRequestLeft');
        this.simVarPublisher.subscribe('ldevRequestRight');
        this.simVarPublisher.subscribe('landingElevation1Raw');
        this.simVarPublisher.subscribe('landingElevation2Raw');

        this.simVarPublisher.subscribe('fcdc1DiscreteWord1Raw');
        this.simVarPublisher.subscribe('fcdc2DiscreteWord1Raw');
        this.simVarPublisher.subscribe('fcdc1DiscreteWord2Raw');
        this.simVarPublisher.subscribe('fcdc2DiscreteWord2Raw');

        this.simVarPublisher.subscribe('fcdc1CaptPitchCommandRaw');
        this.simVarPublisher.subscribe('fcdc2CaptPitchCommandRaw');
        this.simVarPublisher.subscribe('fcdc1FoPitchCommandRaw');
        this.simVarPublisher.subscribe('fcdc2FoPitchCommandRaw');
        this.simVarPublisher.subscribe('fcdc1CaptRollCommandRaw');
        this.simVarPublisher.subscribe('fcdc2CaptRollCommandRaw');
        this.simVarPublisher.subscribe('fcdc1FoRollCommandRaw');
        this.simVarPublisher.subscribe('fcdc2FoRollCommandRaw');

        this.simVarPublisher.subscribe('fac1Healthy');
        this.simVarPublisher.subscribe('fac2Healthy');
        this.simVarPublisher.subscribe('fac1VAlphaProtRaw');
        this.simVarPublisher.subscribe('fac2VAlphaProtRaw');
        this.simVarPublisher.subscribe('fac1VAlphaMaxRaw');
        this.simVarPublisher.subscribe('fac2VAlphaMaxRaw');
        this.simVarPublisher.subscribe('fac1VStallWarnRaw');
        this.simVarPublisher.subscribe('fac2VStallWarnRaw');
        this.simVarPublisher.subscribe('fac1VMaxRaw');
        this.simVarPublisher.subscribe('fac2VMaxRaw');
        this.simVarPublisher.subscribe('fac1VFeNextRaw');
        this.simVarPublisher.subscribe('fac2VFeNextRaw');
        this.simVarPublisher.subscribe('fac1VCTrendRaw');
        this.simVarPublisher.subscribe('fac2VCTrendRaw');
        this.simVarPublisher.subscribe('fac1VManRaw');
        this.simVarPublisher.subscribe('fac2VManRaw');
        this.simVarPublisher.subscribe('fac1V4Raw');
        this.simVarPublisher.subscribe('fac2V4Raw');
        this.simVarPublisher.subscribe('fac1V3Raw');
        this.simVarPublisher.subscribe('fac2V3Raw');
        this.simVarPublisher.subscribe('fac1VLsRaw');
        this.simVarPublisher.subscribe('fac2VLsRaw');
        this.simVarPublisher.subscribe('fac1EstimatedBetaRaw');
        this.simVarPublisher.subscribe('fac2EstimatedBetaRaw');
        this.simVarPublisher.subscribe('fac1BetaTargetRaw');
        this.simVarPublisher.subscribe('fac2BetaTargetRaw');
        this.simVarPublisher.subscribe('trueRefPushbutton');
        this.simVarPublisher.subscribe('irMaintWordRaw');
        this.simVarPublisher.subscribe('trueHeadingRaw');
        this.simVarPublisher.subscribe('trueTrackRaw');
        this.simVarPublisher.subscribe('slatPosLeft');

        FSComponent.render(<PFDComponent bus={this.bus} instrument={this} />, document.getElementById('PFD_CONTENT'));

        // Remove "instrument didn't load" text
        document.getElementById('PFD_CONTENT').querySelector(':scope > h1').remove();
    }

    /**
   * A callback called when the instrument gets a frame update.
   */
    public Update(): void {
        super.Update();

        if (this.gameState !== 3) {
            const gamestate = this.getGameState();
            if (gamestate === 3) {
                this.simVarPublisher.startPublish();
                this.hEventPublisher.startPublish();
                this.adirsValueProvider.start();
            }
            this.gameState = gamestate;
        } else {
            this.simVarPublisher.onUpdate();
            this.simplaneValueProvider.onUpdate();
            this.clock.onUpdate();
        }
    }
}

registerInstrument('a32nx-pfd', A32NX_PFD);
