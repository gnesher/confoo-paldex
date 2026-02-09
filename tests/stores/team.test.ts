import { describe, it, expect, beforeEach } from 'vitest'
import {
  teamStore,
  addPal,
  removePal,
  togglePal,
  isInTeam,
  getTeamSize,
  clearTeam,
} from '~/stores/team'
import { TEAM_STORAGE_KEY, TEAM_STORAGE_VERSION } from '~/schemas/team'
import { MOCK_LAMBALL, MOCK_FOXPARKS, MOCK_PENGULLET } from '../helpers/fixtures'

describe('teamStore', () => {
  beforeEach(() => {
    // Reset store state to empty before each test
    clearTeam()
    localStorage.clear()
  })

  describe('addPal', () => {
    it('should add a Pal to the team', () => {
      addPal(MOCK_LAMBALL)
      expect(teamStore.state.pals).toHaveLength(1)
      expect(teamStore.state.pals[0].id).toBe('001')
    })

    it('should add multiple Pals', () => {
      addPal(MOCK_LAMBALL)
      addPal(MOCK_FOXPARKS)
      expect(teamStore.state.pals).toHaveLength(2)
    })

    it('should be a no-op when adding a duplicate Pal', () => {
      addPal(MOCK_LAMBALL)
      addPal(MOCK_LAMBALL)
      expect(teamStore.state.pals).toHaveLength(1)
    })
  })

  describe('removePal', () => {
    it('should remove a Pal by ID', () => {
      addPal(MOCK_LAMBALL)
      addPal(MOCK_FOXPARKS)
      removePal('001')
      expect(teamStore.state.pals).toHaveLength(1)
      expect(teamStore.state.pals[0].id).toBe('005')
    })

    it('should be a no-op when removing a non-existent Pal', () => {
      addPal(MOCK_LAMBALL)
      removePal('999')
      expect(teamStore.state.pals).toHaveLength(1)
    })
  })

  describe('togglePal', () => {
    it('should add a Pal if not in team', () => {
      togglePal(MOCK_LAMBALL)
      expect(teamStore.state.pals).toHaveLength(1)
    })

    it('should remove a Pal if already in team', () => {
      addPal(MOCK_LAMBALL)
      togglePal(MOCK_LAMBALL)
      expect(teamStore.state.pals).toHaveLength(0)
    })
  })

  describe('isInTeam', () => {
    it('should return true for a Pal in the team', () => {
      addPal(MOCK_LAMBALL)
      expect(isInTeam('001')).toBe(true)
    })

    it('should return false for a Pal not in the team', () => {
      expect(isInTeam('001')).toBe(false)
    })
  })

  describe('getTeamSize', () => {
    it('should return 0 for an empty team', () => {
      expect(getTeamSize()).toBe(0)
    })

    it('should return the correct count', () => {
      addPal(MOCK_LAMBALL)
      addPal(MOCK_FOXPARKS)
      addPal(MOCK_PENGULLET)
      expect(getTeamSize()).toBe(3)
    })
  })

  describe('clearTeam', () => {
    it('should remove all Pals from the team', () => {
      addPal(MOCK_LAMBALL)
      addPal(MOCK_FOXPARKS)
      clearTeam()
      expect(teamStore.state.pals).toHaveLength(0)
    })
  })

  describe('localStorage persistence', () => {
    it('should persist store changes to localStorage', () => {
      addPal(MOCK_LAMBALL)
      const stored = JSON.parse(localStorage.getItem(TEAM_STORAGE_KEY)!)
      expect(stored.version).toBe(TEAM_STORAGE_VERSION)
      expect(stored.pals).toHaveLength(1)
      expect(stored.pals[0].id).toBe('001')
    })

    it('should update localStorage when a Pal is removed', () => {
      addPal(MOCK_LAMBALL)
      addPal(MOCK_FOXPARKS)
      removePal('001')
      const stored = JSON.parse(localStorage.getItem(TEAM_STORAGE_KEY)!)
      expect(stored.pals).toHaveLength(1)
      expect(stored.pals[0].id).toBe('005')
    })

    it('should clear localStorage when team is cleared', () => {
      addPal(MOCK_LAMBALL)
      clearTeam()
      const stored = JSON.parse(localStorage.getItem(TEAM_STORAGE_KEY)!)
      expect(stored.pals).toHaveLength(0)
    })
  })
})
