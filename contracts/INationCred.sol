//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

interface INationCred {
  
  /**
   * Returns `true` if the address belongs to an active Nation3 Citizen; `false` otherwise.
   */
  function isActive(address passportOwnerAddress) external view returns (bool);
}
