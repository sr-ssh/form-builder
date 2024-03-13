import styled from "@emotion/styled";

const LogoStyle = styled.img({
  position: "relative",
  zIndex: 2,
  left: 6,
  padding: 5,
});

const Logo = ({ logo }: { logo?: string }) => (
  <LogoStyle alt="logo" src={logo} width={80} />
);

export default Logo;